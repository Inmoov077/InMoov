"""
Intel RealSense D455 presence guard for InMoove.

Mounted on the robot chest: when a person stands in front for N seconds
(default 5), fires a wake callback so the host can enable motors and greet.
"""

from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass, field, asdict
from typing import Any, Callable, Dict, List, Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)

# Optional heavy deps — imported lazily so Flask still boots without camera
try:
    import cv2
except ImportError:  # pragma: no cover
    cv2 = None  # type: ignore

try:
    import pyrealsense2 as rs
except ImportError:  # pragma: no cover
    rs = None  # type: ignore


WakeCallback = Callable[[Dict[str, Any]], None]


@dataclass
class PresenceConfig:
    """Tunable presence / greeting parameters."""

    presence_seconds: float = 5.0
    min_distance_m: float = 0.45
    max_distance_m: float = 2.2
    # Fraction of central ROI depth pixels that must be "person-range"
    min_person_pixel_ratio: float = 0.08
    # Central ROI as fractions of frame (x0, y0, x1, y1)
    roi: Tuple[float, float, float, float] = (0.20, 0.10, 0.80, 0.95)
    # Cooldown after a successful wake/greet (seconds)
    greet_cooldown_s: float = 25.0
    # Require person to leave before next greet
    require_leave: bool = True
    leave_clear_seconds: float = 1.5
    # Stream
    width: int = 640
    height: int = 480
    fps: int = 15
    # Greeting
    greet_text: str = "Hello, how are you?"
    enable_motors_on_wake: bool = True
    use_hog_confirm: bool = False  # optional OpenCV HOG person detector


@dataclass
class PresenceState:
    running: bool = False
    device_connected: bool = False
    device_name: str = ""
    serial_number: str = ""
    usb_type: str = ""
    person_present: bool = False
    presence_seconds: float = 0.0
    presence_required: float = 5.0
    progress: float = 0.0  # 0..1 toward wake
    awake: bool = False
    last_wake_at: Optional[float] = None
    last_greet_text: str = ""
    last_error: str = ""
    frames: int = 0
    person_pixel_ratio: float = 0.0
    median_distance_m: Optional[float] = None
    waiting_for_leave: bool = False
    timestamp: float = field(default_factory=time.time)

    def to_dict(self) -> dict:
        d = asdict(self)
        return d


class RealSensePresenceGuard:
    """Background D455 depth presence monitor with wake-on-person."""

    def __init__(self, on_wake: Optional[WakeCallback] = None, config: Optional[PresenceConfig] = None):
        self.config = config or PresenceConfig()
        self.on_wake = on_wake
        self._lock = threading.RLock()
        self._stop = threading.Event()
        self._thread: Optional[threading.Thread] = None
        self._pipeline = None
        self._align = None
        self._state = PresenceState(presence_required=self.config.presence_seconds)
        self._latest_jpeg: Optional[bytes] = None
        self._latest_depth_jpeg: Optional[bytes] = None
        self._presence_since: Optional[float] = None
        self._absent_since: Optional[float] = None
        self._wake_fired_for_session = False
        self._hog = None

    # ── public API ────────────────────────────────────────────

    def status(self) -> dict:
        with self._lock:
            st = self._state.to_dict()
            st["config"] = asdict(self.config)
            st["has_frame"] = self._latest_jpeg is not None
            return st

    def update_config(self, **kwargs) -> dict:
        with self._lock:
            for k, v in kwargs.items():
                if hasattr(self.config, k) and v is not None:
                    if k == "roi" and isinstance(v, (list, tuple)) and len(v) == 4:
                        setattr(self.config, k, tuple(float(x) for x in v))
                    else:
                        setattr(self.config, k, type(getattr(self.config, k))(v) if not isinstance(getattr(self.config, k), bool) else bool(v))
            self._state.presence_required = self.config.presence_seconds
            return asdict(self.config)

    def start(self) -> dict:
        with self._lock:
            if self._thread and self._thread.is_alive():
                return {"ok": True, "already_running": True, **self.status()}
            if rs is None:
                return {"ok": False, "error": "pyrealsense2 not installed. pip install pyrealsense2"}
            if cv2 is None:
                return {"ok": False, "error": "opencv-python not installed. pip install opencv-python"}

            self._stop.clear()
            self._wake_fired_for_session = False
            self._presence_since = None
            self._absent_since = None
            self._state = PresenceState(
                running=True,
                presence_required=self.config.presence_seconds,
            )
            self._thread = threading.Thread(target=self._run_loop, name="realsense-presence", daemon=True)
            self._thread.start()
            return {"ok": True, "already_running": False, **self.status()}

    def stop(self) -> dict:
        self._stop.set()
        t = self._thread
        if t and t.is_alive():
            t.join(timeout=4.0)
        with self._lock:
            self._safe_stop_pipeline()
            self._state.running = False
            self._state.person_present = False
            self._state.presence_seconds = 0.0
            self._state.progress = 0.0
            self._thread = None
        return {"ok": True, **self.status()}

    def get_jpeg(self, kind: str = "color") -> Optional[bytes]:
        with self._lock:
            if kind == "depth":
                return self._latest_depth_jpeg
            return self._latest_jpeg

    def list_devices(self) -> List[dict]:
        if rs is None:
            return []
        out = []
        try:
            ctx = rs.context()
            for dev in ctx.query_devices():
                out.append({
                    "name": dev.get_info(rs.camera_info.name) if dev.supports(rs.camera_info.name) else "RealSense",
                    "serial": dev.get_info(rs.camera_info.serial_number) if dev.supports(rs.camera_info.serial_number) else "",
                    "firmware": dev.get_info(rs.camera_info.firmware_version) if dev.supports(rs.camera_info.firmware_version) else "",
                    "usb": dev.get_info(rs.camera_info.usb_type_descriptor) if dev.supports(rs.camera_info.usb_type_descriptor) else "",
                    "product_line": dev.get_info(rs.camera_info.product_line) if dev.supports(rs.camera_info.product_line) else "",
                })
        except Exception as e:
            logger.warning("list_devices failed: %s", e)
        return out

    # ── internal ──────────────────────────────────────────────

    def _safe_stop_pipeline(self):
        try:
            if self._pipeline is not None:
                self._pipeline.stop()
        except Exception:
            pass
        self._pipeline = None
        self._align = None

    def _open_pipeline(self):
        pipeline = rs.pipeline()
        config = rs.config()
        w, h, fps = self.config.width, self.config.height, self.config.fps
        config.enable_stream(rs.stream.depth, w, h, rs.format.z16, fps)
        config.enable_stream(rs.stream.color, w, h, rs.format.bgr8, fps)
        profile = pipeline.start(config)
        align = rs.align(rs.stream.color)

        device = profile.get_device()
        name = device.get_info(rs.camera_info.name) if device.supports(rs.camera_info.name) else "Intel RealSense"
        serial = device.get_info(rs.camera_info.serial_number) if device.supports(rs.camera_info.serial_number) else ""
        usb = device.get_info(rs.camera_info.usb_type_descriptor) if device.supports(rs.camera_info.usb_type_descriptor) else ""

        # Prefer high accuracy depth for people detection
        try:
            depth_sensor = device.first_depth_sensor()
            if depth_sensor.supports(rs.option.visual_preset):
                # 3 = High Accuracy on many D400 devices
                depth_sensor.set_option(rs.option.visual_preset, 3)
        except Exception as e:
            logger.debug("depth preset: %s", e)

        with self._lock:
            self._pipeline = pipeline
            self._align = align
            self._state.device_connected = True
            self._state.device_name = name
            self._state.serial_number = serial
            self._state.usb_type = usb
            self._state.last_error = ""

        logger.info("RealSense started: %s S/N %s USB %s", name, serial, usb)
        return pipeline, align

    def _detect_person(self, depth_m: np.ndarray, color_bgr: np.ndarray) -> Tuple[bool, float, Optional[float], Tuple[int, int, int, int]]:
        """Return (present, pixel_ratio, median_distance_m, roi_px)."""
        h, w = depth_m.shape[:2]
        x0f, y0f, x1f, y1f = self.config.roi
        x0, y0 = int(w * x0f), int(h * y0f)
        x1, y1 = int(w * x1f), int(h * y1f)
        roi = depth_m[y0:y1, x0:x1]
        if roi.size == 0:
            return False, 0.0, None, (x0, y0, x1, y1)

        dmin, dmax = self.config.min_distance_m, self.config.max_distance_m
        mask = (roi >= dmin) & (roi <= dmax) & np.isfinite(roi)
        ratio = float(np.count_nonzero(mask)) / float(roi.size)
        median_d = None
        if np.any(mask):
            median_d = float(np.median(roi[mask]))

        present = ratio >= self.config.min_person_pixel_ratio

        if present and self.config.use_hog_confirm and self._hog is not None:
            try:
                gray = cv2.cvtColor(color_bgr[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
                rects, _ = self._hog.detectMultiScale(gray, winStride=(8, 8), padding=(8, 8), scale=1.05)
                if len(rects) == 0:
                    present = False
            except Exception:
                pass

        return present, ratio, median_d, (x0, y0, x1, y1)

    def _update_presence_logic(self, present: bool, now: float) -> Optional[dict]:
        """Update timers; return wake event dict if should fire."""
        wake_event = None
        cfg = self.config

        with self._lock:
            if present:
                self._absent_since = None
                if self._presence_since is None:
                    self._presence_since = now
                elapsed = now - self._presence_since
                self._state.person_present = True
                self._state.presence_seconds = elapsed
                self._state.progress = min(1.0, elapsed / max(0.1, cfg.presence_seconds))

                can_wake = (
                    elapsed >= cfg.presence_seconds
                    and not self._wake_fired_for_session
                    and (not self._state.waiting_for_leave)
                )
                if can_wake:
                    # cooldown check
                    if self._state.last_wake_at and (now - self._state.last_wake_at) < cfg.greet_cooldown_s:
                        can_wake = False
                if can_wake:
                    self._wake_fired_for_session = True
                    self._state.awake = True
                    self._state.last_wake_at = now
                    self._state.last_greet_text = cfg.greet_text
                    if cfg.require_leave:
                        self._state.waiting_for_leave = True
                    wake_event = {
                        "greet_text": cfg.greet_text,
                        "enable_motors": cfg.enable_motors_on_wake,
                        "presence_seconds": elapsed,
                        "median_distance_m": self._state.median_distance_m,
                        "timestamp": now,
                    }
            else:
                self._presence_since = None
                self._state.person_present = False
                self._state.presence_seconds = 0.0
                self._state.progress = 0.0
                if self._absent_since is None:
                    self._absent_since = now
                elif (now - self._absent_since) >= cfg.leave_clear_seconds:
                    # Person left long enough — allow next greet
                    self._wake_fired_for_session = False
                    self._state.waiting_for_leave = False
                    # Keep awake flag True until explicitly stopped (motors stay on)
            self._state.timestamp = now

        return wake_event

    def _draw_overlay(
        self,
        color_bgr: np.ndarray,
        depth_m: np.ndarray,
        present: bool,
        ratio: float,
        median_d: Optional[float],
        roi_px: Tuple[int, int, int, int],
    ) -> Tuple[np.ndarray, np.ndarray]:
        x0, y0, x1, y1 = roi_px
        overlay = color_bgr.copy()
        box_color = (40, 200, 90) if present else (80, 80, 200)
        cv2.rectangle(overlay, (x0, y0), (x1, y1), box_color, 2)

        with self._lock:
            progress = self._state.progress
            secs = self._state.presence_seconds
            required = self._state.presence_required
            awake = self._state.awake
            waiting = self._state.waiting_for_leave

        # Progress bar
        bar_w = x1 - x0
        fill = int(bar_w * progress)
        cv2.rectangle(overlay, (x0, y1 - 18), (x1, y1 - 6), (30, 30, 30), -1)
        cv2.rectangle(overlay, (x0, y1 - 18), (x0 + fill, y1 - 6), (40, 200, 90) if present else (100, 100, 100), -1)

        lines = [
            f"D455 presence: {'YES' if present else 'no'}",
            f"Timer: {secs:.1f}s / {required:.0f}s",
            f"Depth fill: {ratio * 100:.1f}%",
        ]
        if median_d is not None:
            lines.append(f"Distance: {median_d:.2f} m")
        if awake:
            lines.append("SYSTEM AWAKE")
        if waiting:
            lines.append("Waiting for person to leave…")

        y = 24
        for line in lines:
            cv2.putText(overlay, line, (12, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 0), 3, cv2.LINE_AA)
            cv2.putText(overlay, line, (12, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (240, 240, 240), 1, cv2.LINE_AA)
            y += 22

        # Depth colormap for secondary stream
        d_vis = depth_m.copy()
        d_vis[~np.isfinite(d_vis)] = 0
        d_mm = np.clip(d_vis * 1000.0, 0, 4000).astype(np.uint16)
        d8 = cv2.convertScaleAbs(d_mm, alpha=0.06)
        depth_color = cv2.applyColorMap(d8, cv2.COLORMAP_JET)
        cv2.rectangle(depth_color, (x0, y0), (x1, y1), box_color, 2)

        return overlay, depth_color

    def _encode_jpeg(self, bgr: np.ndarray, quality: int = 75) -> Optional[bytes]:
        try:
            ok, buf = cv2.imencode(".jpg", bgr, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
            if ok:
                return buf.tobytes()
        except Exception as e:
            logger.debug("jpeg encode: %s", e)
        return None

    def _run_loop(self):
        pipeline = None
        align = None
        try:
            if self.config.use_hog_confirm:
                try:
                    self._hog = cv2.HOGDescriptor()
                    self._hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
                except Exception:
                    self._hog = None

            pipeline, align = self._open_pipeline()
            depth_scale = 0.001
            try:
                depth_sensor = pipeline.get_active_profile().get_device().first_depth_sensor()
                depth_scale = float(depth_sensor.get_depth_scale())
            except Exception:
                pass

            while not self._stop.is_set():
                try:
                    frames = pipeline.wait_for_frames(timeout_ms=2500)
                except Exception as e:
                    with self._lock:
                        self._state.last_error = f"frame timeout: {e}"
                    continue

                try:
                    frames = align.process(frames)
                except Exception:
                    pass

                depth_frame = frames.get_depth_frame()
                color_frame = frames.get_color_frame()
                if not depth_frame or not color_frame:
                    continue

                depth_raw = np.asanyarray(depth_frame.get_data())
                color_bgr = np.asanyarray(color_frame.get_data())
                depth_m = depth_raw.astype(np.float32) * depth_scale

                present, ratio, median_d, roi_px = self._detect_person(depth_m, color_bgr)
                now = time.time()

                with self._lock:
                    self._state.person_pixel_ratio = ratio
                    self._state.median_distance_m = median_d
                    self._state.frames += 1

                wake_event = self._update_presence_logic(present, now)

                overlay, depth_vis = self._draw_overlay(color_bgr, depth_m, present, ratio, median_d, roi_px)
                jpeg = self._encode_jpeg(overlay)
                djpeg = self._encode_jpeg(depth_vis, quality=65)
                with self._lock:
                    if jpeg:
                        self._latest_jpeg = jpeg
                    if djpeg:
                        self._latest_depth_jpeg = djpeg

                if wake_event and self.on_wake:
                    try:
                        self.on_wake(wake_event)
                    except Exception as e:
                        logger.exception("on_wake failed: %s", e)
                        with self._lock:
                            self._state.last_error = f"wake callback: {e}"

        except Exception as e:
            logger.exception("RealSense presence loop failed: %s", e)
            with self._lock:
                self._state.last_error = str(e)
                self._state.device_connected = False
                self._state.running = False
        finally:
            self._safe_stop_pipeline()
            with self._lock:
                self._state.running = False
                self._state.device_connected = False
            logger.info("RealSense presence loop stopped")


# Module-level singleton used by Flask
_guard: Optional[RealSensePresenceGuard] = None
_guard_lock = threading.Lock()


def get_presence_guard(on_wake: Optional[WakeCallback] = None) -> RealSensePresenceGuard:
    global _guard
    with _guard_lock:
        if _guard is None:
            _guard = RealSensePresenceGuard(on_wake=on_wake)
        elif on_wake is not None:
            _guard.on_wake = on_wake
        return _guard
