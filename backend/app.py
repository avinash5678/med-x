from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import random
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

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

# --- MongoDB Configuration ---
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    print("WARNING: MONGO_URI not found in environment variables. Database connection will fail.")
    client = None
    db = None
    users_col = None
    orders_col = None
else:
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client.get_database("medz_db")
        users_col = db.users
        orders_col = db.orders
        retailers_col = db.retailers
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        client = None
        db = None
        users_col = None
        orders_col = None
        retailers_col = None


# 🏠 Home route
@app.route("/")
def home():
    return "MedZ Backend Running 🚀"


# 🔐 LOGIN API
@app.route("/login", methods=["POST"])
def login():
    if users_col is None:
        return jsonify({"error": "Database is not connected. Please check MONGO_URI setup."}), 500

    data = request.json

    user = users_col.find_one({"email": {"$regex": f"^{data['email']}$", "$options": "i"}})

    if user and check_password_hash(user["password"], data["password"]):
        safe_user = {
            "name": user.get("name"),
            "email": user["email"]
        }
        return jsonify(safe_user), 200

    return jsonify({"error": "Invalid credentials"}), 401


# 📧 SEND OTP API
@app.route("/send-otp", methods=["POST"])
def send_otp():
    if users_col is None:
        return jsonify({"error": "Database is not connected. Please check MONGO_URI setup."}), 500

    data = request.json
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user_exists = users_col.find_one({"email": {"$regex": f"^{email}$", "$options": "i"}})
    if user_exists:
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
    if users_col is None:
        return jsonify({"error": "Database is not connected. Please check MONGO_URI setup."}), 500

    data = request.json
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user_exists = users_col.find_one({"email": {"$regex": f"^{email}$", "$options": "i"}})
    
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
        missing = []
        if not email: missing.append("email")
        if not otp: missing.append("otp")
        if not new_password: missing.append("new_password")
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    # Verify OTP again to ensure the request is authorized
    stored = otp_store.get(email.lower())
    if not stored or time.time() > stored["expires"] or stored["otp"] != otp:
        return jsonify({"error": "Unauthorized or expired OTP"}), 401

    result = users_col.update_one(
        {"email": {"$regex": f"^{email}$", "$options": "i"}},
        {"$set": {"password": generate_password_hash(new_password)}}
    )

    if result.matched_count == 0:
         return jsonify({"error": "User not found"}), 404
    
    # Consume the OTP so it can't be reused
    del otp_store[email.lower()]

    return jsonify({"message": "Password successfully reset"}), 200


# 🆕 SIGNUP API
@app.route("/signup", methods=["POST"])
def signup():
    if users_col is None:
        return jsonify({"error": "Database is not connected. Please check MONGO_URI setup."}), 500

    data = request.json

    user_exists = users_col.find_one({"email": {"$regex": f"^{data['email']}$", "$options": "i"}})
    if user_exists:
        return jsonify({"error": "User already exists"}), 400

    new_user = {
        "name": data.get("name", ""),
        "email": data["email"].lower(),
        "password": generate_password_hash(data["password"])
    }

    users_col.insert_one(new_user)

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

    order_id = f"ORD-{random.randint(10000, 99999)}"
    new_order = {
        "order_id": order_id,
        "email": data["email"].lower(),
        "items": data["items"],
        "total": data["total"],
        "address": data.get("address", {}),
        "status": "pending",
        "retailer_status": "pending",
        "delivery_status": "none",
        "timestamp": time.time()
    }

    orders_col.insert_one(new_order)

    return jsonify({"success": True, "order_id": order_id}), 200


# 📋 GET ORDERS API
@app.route("/orders/<email>", methods=["GET"])
def get_orders(email):
    user_orders = list(orders_col.find({"email": {"$regex": f"^{email}$", "$options": "i"}}))
    # Convert ObjectId to string for JSON serialization
    for order in user_orders:
        order["_id"] = str(order["_id"])
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


# ============================================================
# 🏪 RETAILER PORTAL APIs
# ============================================================

# 🆕 RETAILER SIGNUP
@app.route("/retailer/signup", methods=["POST"])
def retailer_signup():
    if retailers_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json
    email = data.get("email", "").strip().lower()

    if retailers_col.find_one({"email": email}):
        return jsonify({"error": "Retailer already exists"}), 400

    new_retailer = {
        "name": data.get("name", ""),
        "email": email,
        "password": generate_password_hash(data["password"]),
        "shop_verified": False,
        "shop_details": None,
        "created_at": time.time()
    }

    retailers_col.insert_one(new_retailer)
    return jsonify({"name": new_retailer["name"], "email": new_retailer["email"]}), 200


# 📧 RETAILER SEND OTP
@app.route("/retailer/send-otp", methods=["POST"])
def retailer_send_otp():
    if retailers_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json
    email = data.get("email", "").strip().lower()
    purpose = data.get("purpose", "signup")  # signup or login

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if purpose == "signup":
        if retailers_col.find_one({"email": email}):
            return jsonify({"error": "Retailer already exists"}), 400

    otp = str(random.randint(100000, 999999))
    otp_store[f"retailer_{email}"] = {"otp": otp, "expires": time.time() + 300}

    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_EMAIL
        msg["To"] = email
        msg["Subject"] = "MedZ Retailer - Verification Code"

        body = f"""
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0f172a; border-radius: 16px; color: white;">
            <h2 style="color: #10b981; margin-bottom: 8px;">MedZ Retailer Portal</h2>
            <p style="color: #94a3b8; font-size: 14px;">Your verification code is:</p>
            <div style="background: #1e293b; color: #10b981; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; text-align: center; margin: 16px 0;">
                {otp}
            </div>
            <p style="color: #64748b; font-size: 12px;">This code expires in 5 minutes.</p>
        </div>
        """

        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return jsonify({"message": "OTP sent successfully"}), 200
    except Exception as e:
        print(f"Retailer OTP email error: {e}")
        return jsonify({"error": "Failed to send OTP email."}), 500


# ✅ RETAILER VERIFY OTP
@app.route("/retailer/verify-otp", methods=["POST"])
def retailer_verify_otp():
    data = request.json
    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()

    stored = otp_store.get(f"retailer_{email}")
    if not stored:
        return jsonify({"error": "No OTP was requested"}), 400
    if time.time() > stored["expires"]:
        del otp_store[f"retailer_{email}"]
        return jsonify({"error": "OTP expired"}), 400
    if stored["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    del otp_store[f"retailer_{email}"]
    return jsonify({"verified": True}), 200


# 🔐 RETAILER LOGIN
@app.route("/retailer/login", methods=["POST"])
def retailer_login():
    if retailers_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json
    email = data.get("email", "").strip().lower()

    retailer = retailers_col.find_one({"email": email})
    if retailer and check_password_hash(retailer["password"], data["password"]):
        return jsonify({
            "name": retailer.get("name"),
            "email": retailer["email"],
            "shop_verified": retailer.get("shop_verified", False),
            "shop_details": retailer.get("shop_details")
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


# 📍 RETAILER VERIFY SHOP
@app.route("/retailer/verify-shop", methods=["POST"])
def retailer_verify_shop():
    if retailers_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json
    email = data.get("email", "").strip().lower()

    shop_details = {
        "shop_name": data.get("shop_name", ""),
        "phone": data.get("phone", ""),
        "license_number": data.get("license_number", ""),
        "address": data.get("address", ""),
        "city": data.get("city", ""),
        "state": data.get("state", ""),
        "pincode": data.get("pincode", ""),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "verified_at": time.time()
    }

    retailers_col.update_one(
        {"email": email},
        {"$set": {"shop_verified": True, "shop_details": shop_details}}
    )

    return jsonify({"success": True, "shop_details": shop_details}), 200


# 👤 RETAILER PROFILE
@app.route("/retailer/profile/<email>", methods=["GET"])
def retailer_profile(email):
    if retailers_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    retailer = retailers_col.find_one({"email": email.lower()})
    if not retailer:
        return jsonify({"error": "Retailer not found"}), 404

    return jsonify({
        "name": retailer.get("name"),
        "email": retailer["email"],
        "shop_verified": retailer.get("shop_verified", False),
        "shop_details": retailer.get("shop_details")
    }), 200


# 📋 RETAILER GET ALL ORDERS
@app.route("/retailer/orders", methods=["GET"])
def retailer_get_orders():
    if orders_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    status_filter = request.args.get("status", None)
    query = {}
    if status_filter:
        query["retailer_status"] = status_filter

    all_orders = list(orders_col.find(query).sort("timestamp", -1).limit(100))
    for order in all_orders:
        order["_id"] = str(order["_id"])
    return jsonify(all_orders), 200


# ✅ RETAILER ACCEPT ORDER
@app.route("/retailer/orders/<order_id>/accept", methods=["POST"])
def retailer_accept_order(order_id):
    if orders_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json or {}
    retailer_info = data.get("retailer_info", {})

    result = orders_col.update_one(
        {"order_id": order_id},
        {"$set": {
            "retailer_status": "accepted", 
            "status": "confirmed", 
            "accepted_at": time.time(),
            "retailer_info": retailer_info
        }}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Order not found"}), 404
    return jsonify({"success": True}), 200


# ❌ RETAILER REJECT ORDER
@app.route("/retailer/orders/<order_id>/reject", methods=["POST"])
def retailer_reject_order(order_id):
    if orders_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json or {}
    result = orders_col.update_one(
        {"order_id": order_id},
        {"$set": {"retailer_status": "rejected", "status": "cancelled", "reject_reason": data.get("reason", "")}}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Order not found"}), 404
    return jsonify({"success": True}), 200


# 🚚 RETAILER UPDATE ORDER STATUS
@app.route("/retailer/orders/<order_id>/status", methods=["POST"])
def retailer_update_order_status(order_id):
    if orders_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    data = request.json
    new_status = data.get("status", "")
    allowed = ["packing", "packed", "out_for_delivery", "delivered"]
    if new_status not in allowed:
        return jsonify({"error": f"Invalid status. Allowed: {allowed}"}), 400

    update_fields = {"delivery_status": new_status}
    if new_status == "delivered":
        update_fields["status"] = "delivered"
        update_fields["delivered_at"] = time.time()

    result = orders_col.update_one(
        {"order_id": order_id},
        {"$set": update_fields}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Order not found"}), 404
    return jsonify({"success": True}), 200


# 📊 RETAILER DASHBOARD STATS
@app.route("/retailer/dashboard", methods=["GET"])
def retailer_dashboard():
    if orders_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    total_orders = orders_col.count_documents({})
    pending_orders = orders_col.count_documents({"retailer_status": "pending"})
    accepted_orders = orders_col.count_documents({"retailer_status": "accepted"})
    delivered_orders = orders_col.count_documents({"status": "delivered"})

    # Calculate total revenue from delivered orders
    pipeline = [
        {"$match": {"status": "delivered"}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$total"}}}
    ]
    revenue_result = list(orders_col.aggregate(pipeline))
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0

    # Today's stats
    today_start = time.time() - (time.time() % 86400)
    today_delivered = orders_col.count_documents({"status": "delivered", "delivered_at": {"$gte": today_start}})
    today_orders = orders_col.count_documents({"timestamp": {"$gte": today_start}})

    return jsonify({
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "accepted_orders": accepted_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": total_revenue,
        "today_delivered": today_delivered,
        "today_orders": today_orders
    }), 200


# 📦 GET SINGLE ORDER STATUS (for customer tracking)
@app.route("/order-status/<order_id>", methods=["GET"])
def get_order_status(order_id):
    if orders_col is None:
        return jsonify({"error": "Database is not connected."}), 500

    order = orders_col.find_one({"order_id": order_id})
    if not order:
        return jsonify({"error": "Order not found"}), 404

    order["_id"] = str(order["_id"])
    return jsonify(order), 200


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug)