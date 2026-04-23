from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
import random
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# --- CORS Configuration ---
# In production, restrict to your frontend URL
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[origin.strip() for origin in FRONTEND_URL.split(",")])

# --- OTP Configuration ---
SMTP_EMAIL = os.environ.get("SMTP_EMAIL", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")

# In-memory OTP store: { email: { "otp": "123456", "expires": timestamp } }
otp_store = {}

# --- Data file paths (absolute, so gunicorn doesn't break) ---
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(DATA_DIR, "users.json")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")

# 📁 Ensure data files exist
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, "w") as f:
        json.dump([], f)


# --- Helper to read/write JSON safely ---
def read_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)

def write_json(filepath, data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)


# 🏠 Home route
@app.route("/")
def home():
    return "MedZ Backend Running 🚀"


# 🔐 LOGIN API
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    users = read_json(USERS_FILE)

    for user in users:
        if user["email"] == data["email"] and check_password_hash(user["password"], data["password"]):
            safe_user = {k: v for k, v in user.items() if k != "password"}
            return jsonify(safe_user), 200

    return jsonify({"error": "Invalid credentials"}), 401


# 📧 SEND OTP API
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    users = read_json(USERS_FILE)
    for user in users:
        if user["email"] == email:
            return jsonify({"error": "User already exists"}), 400

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    otp_store[email] = {"otp": otp, "expires": time.time() + 300}

    # Send email
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_EMAIL
        msg["To"] = email
        msg["Subject"] = "Med Z - Your Verification Code"

        body = f"""
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
            <h2 style="color: #0f172a; margin-bottom: 8px;">Med Z</h2>
            <p style="color: #64748b; font-size: 14px;">Your verification code is:</p>
            <div style="background: #0f172a; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; text-align: center; margin: 16px 0;">
                {otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
        """

        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        print(f"OTP sent to {email}")
        return jsonify({"message": "OTP sent successfully"}), 200

    except Exception as e:
        print(f"Email send error: {e}")
        return jsonify({"error": "Failed to send OTP email. Check server SMTP configuration."}), 500


# ✅ VERIFY OTP API
@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email", "").strip()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    stored = otp_store.get(email)

    if not stored:
        return jsonify({"error": "No OTP was requested for this email"}), 400

    if time.time() > stored["expires"]:
        del otp_store[email]
        return jsonify({"error": "OTP has expired. Please request a new one."}), 400

    if stored["otp"] != otp:
        return jsonify({"error": "Invalid OTP. Please try again."}), 400

    del otp_store[email]
    return jsonify({"verified": True}), 200


# 🆕 SIGNUP API
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    users = read_json(USERS_FILE)

    for user in users:
        if user["email"] == data["email"]:
            return jsonify({"error": "User already exists"}), 400

    new_user = {
        "name": data.get("name", ""),
        "email": data["email"],
        "password": generate_password_hash(data["password"])
    }

    users.append(new_user)
    write_json(USERS_FILE, users)

    return jsonify({"name": new_user["name"], "email": new_user["email"]}), 200


# 🤖 CHAT API
@app.route("/chat", methods=["POST"])
def chat():
    message = request.json.get("message", "").lower()

    if "headache" in message:
        return jsonify({"reply": "You can take Dolo 650 for headache."})
    elif "fever" in message:
        return jsonify({"reply": "Paracetamol like Crocin works well for fever."})
    else:
        return jsonify({"reply": "Please describe your symptoms clearly."})


# 📦 PLACE ORDER API
@app.route("/place-order", methods=["POST"])
def place_order():
    data = request.json

    orders = read_json(ORDERS_FILE)

    new_order = {
        "email": data["email"],
        "items": data["items"],
        "total": data["total"],
        "status": "paid"
    }

    orders.append(new_order)
    write_json(ORDERS_FILE, orders)

    return jsonify({"success": True}), 200


# 📋 GET ORDERS API
@app.route("/orders/<email>", methods=["GET"])
def get_orders(email):
    orders = read_json(ORDERS_FILE)
    user_orders = [o for o in orders if o["email"] == email]
    return jsonify(user_orders)


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug)