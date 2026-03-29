from flask import Blueprint, jsonify, request
import requests
import joblib
import re
import os
import uuid
import logging
from nltk.corpus import stopwords
from supabase_client import supabase

emergency_bp = Blueprint('emergency_bp', __name__)
logging.basicConfig(level=logging.INFO)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

type_model          = joblib.load(os.path.join(MODELS_DIR, "emergency_model.pkl"))
severity_model      = joblib.load(os.path.join(MODELS_DIR, "severity_model.pkl"))
vectorizer          = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
severity_vectorizer = joblib.load(os.path.join(MODELS_DIR, "severity_vectorizer.pkl"))

stop_words = set(stopwords.words('english')) - {
    "help", "urgent", "now", "emergency", "immediately"
}

def clean_text(text):
    try:
        if not text:
            return ""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z ]', '', text)
        words = text.split()
        words = [w for w in words if w not in stop_words]
        return " ".join(words)
    except Exception as e:
        logging.error(f"CLEAN ERROR: {e}")
        return text

@emergency_bp.route('/predict', methods=['POST'])
def predict():
    try:
        print("🔥 HIT /api/predict")

        data = request.get_json() or {}
        print("DATA:", data)

        emergency = data.get("emergency", "").strip()
        lat = data.get("lat")
        lon = data.get("lon")

        if not emergency:
            return jsonify({"status": "error", "message": "No emergency text provided"}), 400

        cleaned = clean_text(emergency)

        X_type     = vectorizer.transform([cleaned])
        X_severity = severity_vectorizer.transform([cleaned])

        type_    = type_model.predict(X_type)[0]
        severity = severity_model.predict(X_severity)[0]

        type_conf     = float(type_model.predict_proba(X_type).max())
        severity_conf = float(severity_model.predict_proba(X_severity).max())

        suggestion_map = {
            "fire": "Evacuate immediately and call fire services",
            "medical": "Provide first aid and call ambulance",
            "accident": "Provide first aid and call ambulance",
            "crime": "Stay safe and contact police"
        }
        suggestion = suggestion_map.get(type_.lower(), "Stay safe and alert authorities")

        # First aid
        first_aid = ["Stay calm", "Follow safety instructions"]
        
        # Dummy fallback (in case API fails)
        service_name = "Nearby Service"
        s_lat, s_lon = None, None

        inci_id = "INC-" + str(uuid.uuid4())[:8].upper()

        try:
            supabase.table("emergencies").insert({
                "id": inci_id,
                "type": type_,
                "severity": severity,
                "suggestion": suggestion,
                "latitude": lat,
                "longitude": lon,
                "status": "pending"
            }).execute()
        except Exception as db_error:
            logging.error(f"SUPABASE ERROR: {db_error}")

        map_url = ""
        if lat and lon and s_lat and s_lon:
            map_url = f"https://www.google.com/maps/dir/?api=1&origin={lat},{lon}&destination={s_lat},{s_lon}"

        return jsonify({
            "type": type_,
            "severity": severity,
            "suggestion": suggestion,
            "first_aid": first_aid,
            "service_name": service_name,
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