"""InMoove Core — native robot runtime (no external MyRobotLab process)."""

from .runtime import InMooveCore, get_core

try:
    from .realsense_presence import RealSensePresenceGuard, get_presence_guard
except Exception:  # optional camera stack
    RealSensePresenceGuard = None  # type: ignore
    get_presence_guard = None  # type: ignore

__all__ = [
    "InMooveCore",
    "get_core",
    "RealSensePresenceGuard",
    "get_presence_guard",
]
__version__ = "1.1.0"
