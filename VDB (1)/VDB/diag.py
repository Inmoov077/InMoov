"""
Direct serial test — bypasses Flask, talks to Arduino directly.
Tests if the Arduino firmware is actually moving servos.
"""
import serial
import time

PORT = "COM12"
BAUD = 115200

print("=" * 50)
print("  DIRECT ARDUINO SERVO TEST")
print("=" * 50)

try:
    ser = serial.Serial(PORT, BAUD, timeout=2)
    print(f"Opened {PORT} at {BAUD} baud")
    print("Waiting for Arduino reset (3 seconds)...")
    time.sleep(3)

    # Drain any startup messages
    while ser.in_waiting:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        print(f"  [STARTUP] {line}")

    def send(cmd):
        print(f"\n>>> Sending: {cmd}")
        ser.write((cmd + "\n").encode())
        time.sleep(0.8)
        responses = []
        while ser.in_waiting:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            print(f"  <<< {line}")
            responses.append(line)
        return responses

    # Step 1: Status check
    print("\n" + "=" * 50)
    print("STEP 1: Checking status")
    send("CMD:STATUS")

    # Step 2: Ensure all parts enabled
    print("\n" + "=" * 50)
    print("STEP 2: Enabling all parts (mask=15)")
    send("CMD:ENABLE:15")

    # Step 3: Send HOME
    print("\n" + "=" * 50)
    print("STEP 3: Sending HOME")
    send("CMD:HOME")
    time.sleep(2)

    # Step 4: Move a DS5160 servo (right shoulder, pin 23)
    print("\n" + "=" * 50)
    print("STEP 4: Moving r_shoulder to 90 degrees")
    print("  >>> This is a DS5160 on pin 23 — watch the right shoulder!")
    send("CMD:MOVE:r_shoulder:90")
    time.sleep(2)

    # Step 5: Move back
    print("\n" + "=" * 50)
    print("STEP 5: Moving r_shoulder back to 30 (rest)")
    send("CMD:MOVE:r_shoulder:30")
    time.sleep(2)

    # Step 6: Move a PCA9685 servo (right thumb, ch 0)
    print("\n" + "=" * 50)
    print("STEP 6: Moving r_thumb to 90 degrees")
    print("  >>> This is MG996R on PCA9685 ch 0 — watch the right thumb!")
    send("CMD:MOVE:r_thumb:90")
    time.sleep(2)

    # Step 7: Move thumb back
    print("\n" + "=" * 50)
    print("STEP 7: Moving r_thumb back to 10 (rest)")
    send("CMD:MOVE:r_thumb:10")
    time.sleep(2)

    # Step 8: Try grip command
    print("\n" + "=" * 50)
    print("STEP 8: Grip right hand at 100%")
    print("  >>> All right fingers should close!")
    send("CMD:GRIP:100")
    time.sleep(2)

    # Step 9: Release
    print("\n" + "=" * 50)
    print("STEP 9: Grip right hand at 0%")
    print("  >>> All right fingers should open!")
    send("CMD:GRIP:0")
    time.sleep(2)

    # Step 10: Final HOME
    print("\n" + "=" * 50)
    print("STEP 10: Final HOME")
    send("CMD:HOME")
    time.sleep(2)

    print("\n" + "=" * 50)
    print("TEST COMPLETE")
    print("=" * 50)
    print("Did ANY servo move during the test?")
    print("  If YES -> Problem is in the Flask server / WebSocket layer")
    print("  If NO  -> Problem is hardware (power/wiring) or firmware")
    print("=" * 50)

    ser.close()

except serial.SerialException as e:
    print(f"Serial error: {e}")
    print("Make sure the Flask server is STOPPED and no other program is using COM12")
except Exception as e:
    print(f"Error: {e}")
