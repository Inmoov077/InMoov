#!/usr/bin/env python3
"""Quick diagnostic for Intel RealSense presence stack."""

from __future__ import annotations

import json
import sys


def main() -> int:
    report = {
        "numpy": False,
        "cv2": False,
        "pyrealsense2": False,
        "devices": [],
        "errors": [],
    }

    try:
        import numpy  # noqa: F401

        report["numpy"] = True
    except Exception as e:  # pragma: no cover
        report["errors"].append(f"numpy: {e}")

    try:
        import cv2  # noqa: F401

        report["cv2"] = True
    except Exception as e:  # pragma: no cover
        report["errors"].append(f"cv2: {e}")

    try:
        import pyrealsense2 as rs

        report["pyrealsense2"] = True
        ctx = rs.context()
        for dev in ctx.query_devices():
            item = {}
            for key, attr in (
                ("name", rs.camera_info.name),
                ("serial", rs.camera_info.serial_number),
                ("usb", rs.camera_info.usb_type_descriptor),
                ("firmware", rs.camera_info.firmware_version),
            ):
                try:
                    if dev.supports(attr):
                        item[key] = dev.get_info(attr)
                except Exception:
                    pass
            report["devices"].append(item)
    except Exception as e:  # pragma: no cover
        report["errors"].append(f"pyrealsense2: {e}")

    print(json.dumps(report, indent=2))
    ok = report["numpy"] and report["cv2"] and report["pyrealsense2"]
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
