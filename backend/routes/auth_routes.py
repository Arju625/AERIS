from flask import Blueprint, request, jsonify
from supabase_client import supabase  # your Supabase client
import logging

auth_bp = Blueprint("auth_bp", __name__)
logging.basicConfig(level=logging.INFO)

# -------------------- VERIFY TOKEN --------------------
def verify_token(token):
    """Verify Supabase JWT token."""
    try:
        user_resp = supabase.auth.get_user(token)
        if user_resp.data and user_resp.data.user:
            return user_resp.data.user
        else:
            return None
    except Exception as e:
        logging.error(f"Token verification failed: {e}")
        return None

# -------------------- PROTECTED ROUTE EXAMPLE --------------------
@auth_bp.route("/profile", methods=["GET"])
def profile():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"status": "error", "message": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    user = verify_token(token)
    if not user:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    # Return minimal user info
    return jsonify({
        "status": "success",
        "user": {
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at
        }
    })

# -------------------- OPTIONAL: SIGNUP/LOGIN (BACKEND) --------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password required"}), 400

    try:
        resp = supabase.auth.sign_in_with_password({"email": email, "password": password})
        
        # ✅ newer supabase-py v2 uses resp.session and resp.user directly
        session = resp.session
        user = resp.user

        if session:
            return jsonify({
                "status": "success",
                "access_token": session.access_token,
                "user": {
                    "id": str(user.id),
                    "email": user.email
                }
            })
        else:
            return jsonify({"status": "error", "message": "Login failed"}), 401

    except Exception as e:
        logging.error(f"Login error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

