from flask import Flask, jsonify, request, send_from_directory
import serial
import serial.tools.list_ports
import threading
import time
import os

app = Flask(__name__)

# --------------------------------------------------
# Find Arduino automatically
# --------------------------------------------------

arduino = None
distance = -1
alert = False

def find_arduino():
    ports = serial.tools.list_ports.comports()

    for port in ports:
        print("Found:", port.device, port.description)

        # Try each serial device
        try:
            connection = serial.Serial(
                port.device,
                9600,
                timeout=1
            )

            time.sleep(2)

            print("Connected to:", port.device)
            return connection

        except Exception:
            pass

    return None


# --------------------------------------------------
# Read Arduino data
# --------------------------------------------------

def read_arduino():
    global distance
    global alert

    while True:

        if arduino is not None:

            try:
                line = arduino.readline().decode(
                    "utf-8",
                    errors="ignore"
                ).strip()

                if line:
                    print("Arduino:", line)

                    if line.startswith("Distance:"):

                        try:
                            value = line.replace(
                                "Distance:", ""
                            ).replace(
                                "cm", ""
                            ).strip()

                            if value != "OUT_OF_RANGE":
                                distance = float(value)
                            else:
                                distance = -1

                        except:
                            pass

                    if "ALERT: Person detected!" in line:
                        alert = True

                    elif line.startswith("Distance:"):

                        if distance <= 0 or distance > 50:
                            alert = False

            except Exception as e:
                print("Serial error:", e)

        time.sleep(0.05)


# --------------------------------------------------
# Website
# --------------------------------------------------

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# --------------------------------------------------
# Get current Arduino status
# --------------------------------------------------

@app.route("/status")
def status():

    return jsonify({
        "distance": distance,
        "alert": alert,
        "connected": arduino is not None
    })


# --------------------------------------------------
# Control LED
# --------------------------------------------------

@app.route("/led/<state>")
def led(state):

    if arduino is None:
        return jsonify({
            "success": False,
            "message": "Arduino not connected"
        })

    if state == "on":
        arduino.write(b"LED_ON\n")

    elif state == "off":
        arduino.write(b"LED_OFF\n")

    else:
        return jsonify({
            "success": False,
            "message": "Invalid state"
        })

    return jsonify({
        "success": True,
        "led": state
    })


# --------------------------------------------------
# Control buzzer
# --------------------------------------------------

@app.route("/buzzer/<state>")
def buzzer(state):

    if arduino is None:
        return jsonify({
            "success": False,
            "message": "Arduino not connected"
        })

    if state == "on":
        arduino.write(b"BUZZER_ON\n")

    elif state == "off":
        arduino.write(b"BUZZER_OFF\n")

    else:
        return jsonify({
            "success": False,
            "message": "Invalid state"
        })

    return jsonify({
        "success": True,
        "buzzer": state
    })


# --------------------------------------------------
# Upload picture
# --------------------------------------------------

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/upload", methods=["POST"])
def upload():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image selected"
        })

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "success": False,
            "message": "No image selected"
        })

    filename = image.filename

    path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    image.save(path)

    return jsonify({
        "success": True,
        "message": "Image uploaded successfully"
    })


# --------------------------------------------------
# Start
# --------------------------------------------------

if __name__ == "__main__":

    print()
    print("Searching for Arduino...")
    
    arduino = find_arduino()

    if arduino is None:
        print("Arduino not found.")
        print("Check USB connection and COM port.")
    else:
        print("Arduino connected successfully!")

    thread = threading.Thread(
        target=read_arduino,
        daemon=True
    )

    thread.start()

    print()
    print("Website starting...")
    print("Open: http://127.0.0.1:5000")
    print()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
