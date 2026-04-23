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
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
        if user["email"].lower() == data["email"].lower() and check_password_hash(user["password"], data["password"]):
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
        if user["email"].lower() == email.lower():
            return jsonify({"error": "User already exists"}), 400

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    otp_store[email.lower()] = {"otp": otp, "expires": time.time() + 300}

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

    stored = otp_store.get(email.lower())

    if not stored:
        return jsonify({"error": "No OTP was requested for this email"}), 400

    if time.time() > stored["expires"]:
        del otp_store[email.lower()]
        return jsonify({"error": "OTP has expired. Please request a new one."}), 400

    if stored["otp"] != otp:
        return jsonify({"error": "Invalid OTP. Please try again."}), 400

    del otp_store[email.lower()]
    return jsonify({"verified": True}), 200


# 🔄 SEND RESET OTP API
@app.route("/send-reset-otp", methods=["POST"])
def send_reset_otp():
    data = request.json
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    users = read_json(USERS_FILE)
    user_exists = any(user["email"].lower() == email.lower() for user in users)
    
    if not user_exists:
        return jsonify({"error": "No account found with this email"}), 404

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    otp_store[email.lower()] = {"otp": otp, "expires": time.time() + 300}

    # Send email
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_EMAIL
        msg["To"] = email
        msg["Subject"] = "Med Z - Password Reset Code"

        body = f"""
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
            <h2 style="color: #0f172a; margin-bottom: 8px;">Med Z</h2>
            <p style="color: #64748b; font-size: 14px;">Your password reset code is:</p>
            <div style="background: #0f172a; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; text-align: center; margin: 16px 0;">
                {otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please secure your account immediately.</p>
        </div>
        """

        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return jsonify({"message": "Password reset OTP sent"}), 200
    except Exception as e:
        print(f"Email send error: {e}")
        return jsonify({"error": "Failed to send reset email. Try again later."}), 500


# 🔄 VERIFY RESET OTP API
@app.route("/verify-reset-otp", methods=["POST"])
def verify_reset_otp():
    # Exactly same logic as verify_otp, just an explicit endpoint for clarity
    data = request.json
    email = data.get("email", "").strip()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    stored = otp_store.get(email.lower())
    if not stored:
        return jsonify({"error": "No OTP requested or it expired"}), 400
    if time.time() > stored["expires"]:
        del otp_store[email.lower()]
        return jsonify({"error": "OTP has expired. Please request a new one."}), 400
    if stored["otp"] != otp:
        return jsonify({"error": "Invalid OTP. Please try again."}), 400

    # DO NOT delete the OTP from store yet, we need it to authorize the actual reset request!
    # Instead, we return a success token and verify it again at the final reset step.
    return jsonify({"verified": True}), 200


# 🔒 RESET PASSWORD API
@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email", "").strip()
    otp = data.get("otp", "").strip()
    new_password = data.get("new_password", "")

    if not email or not otp or not new_password:
        return jsonify({"error": "Missing required fields"}), 400

    # Verify OTP again to ensure the request is authorized
    stored = otp_store.get(email.lower())
    if not stored or time.time() > stored["expires"] or stored["otp"] != otp:
        return jsonify({"error": "Unauthorized or expired OTP"}), 401

    users = read_json(USERS_FILE)
    user_found = False

    for user in users:
        if user["email"].lower() == email.lower():
            user["password"] = generate_password_hash(new_password)
            user_found = True
            break

    if not user_found:
         return jsonify({"error": "User not found"}), 404

    write_json(USERS_FILE, users)
    
    # Consume the OTP so it can't be reused
    del otp_store[email.lower()]

    return jsonify({"message": "Password successfully reset"}), 200


# 🆕 SIGNUP API
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    users = read_json(USERS_FILE)

    for user in users:
        if user["email"].lower() == data["email"].lower():
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
    user_orders = [o for o in orders if o["email"].lower() == email.lower()]
    return jsonify(user_orders)


# 📬 CONTACT US API
@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    try:
        msg = MIMEMultipart()
        msg["From"] = f"Med Z Pharmacy <{SMTP_EMAIL}>"
        msg["To"] = SMTP_EMAIL
        msg["Reply-To"] = email
        msg["Subject"] = f"Med Z Contact - From {name}"

        body = f"""
        <div style="font-family: sans-serif; padding: 20px; background: #f8fafc;">
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>{message}</p>
        </div>
        """

        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return jsonify({"success": True, "message": "Your message has been sent successfully!"}), 200

    except Exception as e:
        print(f"Contact email error: {e}")
        return jsonify({"error": "Failed to send message. Try again later."}), 500


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug)