import os
import re
import sys
import time
import serial
import serial.tools.list_ports

# Optional TTS support
try:
    import pyttsx3
    tts_engine = pyttsx3.init()
    tts_engine.setProperty('rate', 150) # Natural speech speed
except Exception:
    tts_engine = None

# Import the local vector search module
try:
    import vector_db
except ImportError:
    vector_db = None

def load_offline_commands():
    """Dynamically parses and extracts the offline commands database from combined_dashboard.html
    to ensure changes made in the dashboard are automatically reflected in the CLI.
    """
    html_path = os.path.join(os.path.dirname(__file__), "dashboard.html")
    if not os.path.exists(html_path):
        print(f"Warning: '{html_path}' not found. No predefined local database loaded.")
        return []
        
    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
    match = re.search(r"const OFFLINE_COMMANDS\s*=\s*\[(.*?)\]\s*; let offlineRecognition", content, re.DOTALL)
    if not match:
        match = re.search(r"const OFFLINE_COMMANDS\s*=\s*\[(.*?)\]\s*;", content, re.DOTALL)
        
    if not match:
        print("Warning: Could not parse OFFLINE_COMMANDS from dashboard HTML.")
        return []
        
    array_content = match.group(1)
    
    # Locate individual objects
    objs = re.findall(r"\{\s*inputs:.*?\n\s*\}", array_content, re.DOTALL)
    if not objs:
        objs = re.findall(r"\{.*?\}", array_content, re.DOTALL)
        
    commands = []
    for obj in objs:
        inputs_match = re.search(r"inputs:\s*\[(.*?)\]", obj, re.DOTALL)
        response_match = re.search(r"response:\s*['\"](.*?)['\"],", obj, re.DOTALL)
        angles_match = re.search(r"angles:\s*\{(.*?)\}", obj, re.DOTALL)
        animation_match = re.search(r"animation:\s*['\"](.*?)['\"]", obj, re.DOTALL)
        
        if inputs_match and response_match and angles_match:
            inputs_str = inputs_match.group(1)
            response = response_match.group(1)
            angles_str = angles_match.group(1)
            animation = animation_match.group(1) if animation_match else "none"
            
            inputs = [i.strip("'\" ") for i in inputs_str.split(",") if i.strip()]
            
            angles = {}
            for part in angles_str.split(","):
                if ":" in part:
                    k, v = part.split(":")
                    angles[k.strip()] = int(v.strip())
                    
            commands.append({
                "inputs": inputs,
                "response": response,
                "angles": angles,
                "animation": animation
            })
            
    return commands

def get_phrase_similarity(str1, str2):
    """Calculates query word similarity matching the Dice coefficient method in JavaScript."""
    def clean(s):
        s = s.lower()
        s = re.sub(r'[^\w\s]', '', s)
        return [w for w in s.split() if w]
        
    words1 = clean(str1)
    words2 = clean(str2)
    
    if not words1 or not words2:
        return 0.0
        
    stop_words = {
        'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'to', 'for', 'of', 'in', 'on', 'about', 
        'what', 'who', 'how', 'tell', 'me', 'please', 'you', 'your', 'and', 'with', 'by', 'here', 
        'there', 'our', 'my'
    }
    
    filtered1 = [w for w in words1 if w not in stop_words]
    filtered2 = [w for w in words2 if w not in stop_words]
    
    list1 = filtered1 if filtered1 else words1
    list2 = filtered2 if filtered2 else words2
    
    def get_stem(w):
        return w[:4] if len(w) > 4 else w
        
    stems2 = {get_stem(w) for w in list2}
    
    intersection = 0
    for w in list1:
        if get_stem(w) in stems2:
            intersection += 1
            
    return (2.0 * intersection) / (len(list1) + len(list2))

def connect_arduino():
    """Detects and connects to the Arduino board via serial."""
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        print("No serial ports detected. Running in simulation mode (commands printed to console).")
        return None
        
    arduino_keywords = ["arduino", "ch340", "usb-serial", "usb serial", "usb_serial", "ftdi"]
    target_port = None
    
    for p in ports:
        desc = p.description.lower() if p.description else ""
        mfg = p.manufacturer.lower() if p.manufacturer else ""
        if any(kw in desc or kw in mfg for kw in arduino_keywords):
            target_port = p.device
            break
            
    if not target_port:
        target_port = ports[0].device
        
    print(f"Connecting to Arduino on {target_port} at 9600 baud...")
    try:
        ser = serial.Serial(target_port, 9600, timeout=1)
        time.sleep(2) # Allow Arduino time to reset
        # Perform simple handshake
        ser.write(b'?')
        time.sleep(0.5)
        response = ser.read_all().decode('utf-8', errors='ignore').strip()
        print(f"Handshake response: {response.replace(chr(10), ' | ').replace(chr(13), '')}")
        return ser
    except Exception as e:
        print(f"Could not connect to {target_port}: {e}")
        print("Running in simulation mode.")
        return None

def send_servo_command(ser, angles):
    """Sends combined 6-axis servo positions to the Arduino.
    Format: C,<hneck>,<eye>,<jaw>,<neckRot>,<neckTilt>,<neckRoll>\n
    """
    # Map the database properties to the Arduino command values
    hn = angles.get('hneck', 85)
    he = angles.get('eye', 90)
    hj = angles.get('jaw', 8)  # default closed jaw
    nr = angles.get('neckRot', 60)
    nt = angles.get('neckTilt', 50)
    nro = angles.get('neckRoll', 120)
    
    cmd_str = f"C,{hn},{he},{hj},{nr},{nt},{nro}\n"
    
    if ser and ser.is_open:
        try:
            ser.write(cmd_str.encode('utf-8'))
            ser.flush()
        except Exception as e:
            print(f"\n[Serial Error] Failed to transmit movement: {e}")
    else:
        print(f"[Simulated] {cmd_str.strip()}")

def speak(text):
    """Prints response to console and speaks aloud if TTS engine is initialized."""
    print(f"\nRobot: {text}")
    if tts_engine:
        try:
            tts_engine.say(text)
            tts_engine.runAndWait()
        except Exception:
            pass

def main():
    print("==========================================================")
    print("        INMOOV HEAD COMMAND-LINE CONVERSATION TERMINAL    ")
    print("==========================================================")
    print("Loading databases...")
    
    # 1. Load Local Dictionary
    offline_db = load_offline_commands()
    print(f"Loaded {len(offline_db)} predefined commands from dashboard.")
    
    # 2. Check Vector DB status
    v_db_ready = False
    if vector_db and os.path.exists(vector_db.DB_FILE):
        v_db_ready = True
        print("Local Vector Database (RAG) found and active.")
    else:
        print("Warning: Vector DB not initialized. Run 'python vector_db.py index knowledge_base.txt' to enable RAG fallback.")
        
    # 3. Connect to Arduino
    ser = connect_arduino()
    
    print("\nRobot is ready! Type 'exit', 'quit', or 'center' to manage the session.")
    print("-" * 58)
    
    # Set to initial default centered position
    default_angles = { 'hneck': 85, 'eye': 90, 'neckRot': 60, 'neckTilt': 50, 'neckRoll': 120 }
    send_servo_command(ser, default_angles)
    
    while True:
        try:
            user_input = input("\nYou > ").strip()
            if not user_input:
                continue
                
            q = user_input.lower()
            
            if q in ['exit', 'quit']:
                print("Centering and exiting. Goodbye!")
                send_servo_command(ser, default_angles)
                time.sleep(0.5)
                break
                
            if q == 'center':
                print("Centering servos...")
                send_servo_command(ser, default_angles)
                continue
                
            # 1. Match predefined offline commands (exact/substring)
            match = None
            for cmd in offline_db:
                if any(phrase in q or q in phrase for phrase in [i.lower() for i in cmd['inputs']]):
                    match = cmd
                    break
                    
            # 2. Fuzzy match predefined commands
            if not match:
                best_score = 0.0
                best_cmd = None
                for cmd in offline_db:
                    for phrase in cmd['inputs']:
                        score = get_phrase_similarity(q, phrase)
                        if score > best_score:
                            best_score = score
                            best_cmd = cmd
                            
                if best_score >= 0.45:
                    match = best_cmd
                    print(f"[Fuzzy Match Score: {best_score:.2f}]")
                    
            # 3. Search Vector Database (RAG Fallback)
            if not match and v_db_ready:
                print("Checking local Vector DB...")
                res = vector_db.search_db(user_input, top_k=1)
                if res.get('ok') and res.get('results'):
                    best = res['results'][0]
                    if best['score'] >= 0.08:
                        match = {
                            "response": best['chunk'],
                            "angles": default_angles, # Nod/Center
                            "animation": "nod"
                        }
                        print(f"[Vector DB RAG Match Score: {best['score']:.4f}]")
                        
            # Execute command / speech
            if match:
                # Send movements to Arduino
                send_servo_command(ser, match['angles'])
                
                # Speak response
                speak(match['response'])
                
                # If there's an animation like 'nod', trigger head shake/nod wiggles
                if match.get('animation') == 'nod':
                    time.sleep(0.4)
                    # Simple nod wiggle sequence
                    nod_up = dict(match['angles'], neckTilt=75)
                    send_servo_command(ser, nod_up)
                    time.sleep(0.3)
                    send_servo_command(ser, match['angles'])
            else:
                # Final generic fallback response
                fallback_text = "I didn't quite catch that. Could you please rephrase or repeat your question?"
                # Shake head (horizontal rotate)
                shake_left = dict(default_angles, neckRot=90)
                shake_right = dict(default_angles, neckRot=30)
                
                send_servo_command(ser, shake_left)
                time.sleep(0.35)
                send_servo_command(ser, shake_right)
                time.sleep(0.35)
                send_servo_command(ser, default_angles)
                
                speak(fallback_text)
                
        except KeyboardInterrupt:
            print("\nInterrupt received. Exiting...")
            send_servo_command(ser, default_angles)
            break
        except Exception as e:
            print(f"Error in processing query: {e}")
            
    if ser:
        ser.close()

if __name__ == "__main__":
    main()
