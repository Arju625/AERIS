from flask import Blueprint, jsonify, request
import sqlite3
import requests
import joblib
import re
import logging
from nltk.corpus import stopwords

# -------- BLUEPRINT --------
emergency_bp = Blueprint('emergency_bp', __name__)

# -------- LOGGING --------
logging.basicConfig(level=logging.INFO)

# -------- LOAD ML MODELS --------
type_model = joblib.load("emergency_model.pkl")
severity_model = joblib.load("severity_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# -------- CUSTOM STOPWORDS --------
stop_words = set(stopwords.words('english')) - {
    "help", "urgent", "now", "emergency", "immediately"
}

# -------- CLEAN TEXT --------
def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)

# -------------------- FIRST AID --------------------
def get_first_aid(type_, severity):
    type_ = type_.lower()
    severity = severity.lower()

    base_steps = {
        "medical": [
            "Check if the person is conscious",
            "Ensure airway is clear",
            "Lay them flat and elevate legs"
        ],
        "fire": [
            "Evacuate the area immediately",
            "Avoid using elevators",
            "Cover nose with cloth to avoid smoke"
        ],
        "accident": [
            "Check for injuries",
            "Do not move seriously injured person",
            "Apply pressure to stop bleeding"
        ],
        "crime": [
            "Move to a safe location",
            "Avoid confrontation",
            "Alert nearby people"
        ]
    }

    steps = base_steps.get(type_, ["Stay calm", "Follow safety instructions"])
    if severity == "high":
        steps.append("Call emergency services immediately")
    else:
        steps.append("Seek help if needed")
    return steps

# -------------------- FIND NEAREST SERVICE --------------------
def get_nearest_service(lat, lon, emergency_type):
    try:
        if lat is None or lon is None:
            return "Location not available", lat, lon

        query = "police"
        if emergency_type.lower() == "fire":
            query = "fire_station"
        elif emergency_type.lower() in ["accident", "medical"]:
            query = "hospital"

        overpass_url = "https://overpass-api.de/api/interpreter"
        overpass_query = f"""
        [out:json];
        node
          ["amenity"="{query}"]
          (around:5000,{lat},{lon});
        out;
        """
        response = requests.get(overpass_url, params={'data': overpass_query}, timeout=5)
        if response.status_code != 200:
            return "Service unavailable", lat, lon

        data = response.json()
        if data.get("elements"):
            closest = min(
                data["elements"],
                key=lambda x: (x["lat"] - lat)**2 + (x["lon"] - lon)**2
            )
            name = closest.get("tags", {}).get("name", query.title())
            return name, closest["lat"], closest["lon"]
        return "Not Found", lat, lon
    except Exception as e:
        logging.error(f"OVERPASS ERROR: {e}")
        return "Error fetching service", lat, lon

# -------------------- PREDICT API --------------------
@emergency_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        emergency = data.get("emergency", "").strip()
        lat = data.get("lat")
        lon = data.get("lon")

        if not emergency:
            return jsonify({"status": "error", "message": "No emergency text provided"}), 400

        # CLEAN
        cleaned = clean_text(emergency)

        # ML PREDICTION
        X_input = vectorizer.transform([cleaned])
        type_ = type_model.predict(X_input)[0]
        severity = severity_model.predict(X_input)[0]

        type_conf = float(type_model.predict_proba(X_input).max())
        severity_conf = float(severity_model.predict_proba(X_input).max())

        # SUGGESTION
        suggestion_map = {
            "fire": "Evacuate immediately and call fire services",
            "medical": "Provide first aid and call ambulance",
            "accident": "Provide first aid and call ambulance",
            "crime": "Stay safe and contact police"
        }
        suggestion = suggestion_map.get(type_.lower(), "Stay safe and alert authorities")

        # FIRST AID
        first_aid = get_first_aid(type_, severity)

        # NEAREST SERVICE
        service_name, s_lat, s_lon = get_nearest_service(lat, lon, type_)

        # SAVE TO DB
        try:
            conn = sqlite3.connect("database.db")
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO emergencies (type, severity) VALUES (?, ?)",
                (type_, severity)
            )
            conn.commit()
        finally:
            conn.close()

        # -------------------- MAP URL --------------------
        # MAP URL using Google Maps directions
        map_url = ""
        if lat is not None and lon is not None and s_lat is not None and s_lon is not None:
            map_url = f"https://www.google.com/maps/dir/?api=1&origin={lat},{lon}&destination={s_lat},{s_lon}&travelmode=driving"
        return jsonify({
            "type": type_,
            "severity": severity,
            "suggestion": suggestion,
            "first_aid": first_aid,
            "service_name": service_name,
            "user_location": {"lat": lat, "lon": lon},
            "map_url": map_url,
            "high_alert": severity.lower() == "high",
            "confidence": {
                "type": round(type_conf, 2),
                "severity": round(severity_conf, 2)
            }
        })

    except Exception as e:
        logging.error(f"PREDICT ERROR: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500