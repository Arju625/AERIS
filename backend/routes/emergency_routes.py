from flask import Blueprint, jsonify, request
import sqlite3
import requests
import joblib
import re
import logging
import math
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

# -------- 📍 HAVERSINE DISTANCE --------
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c

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
            logging.error("No location received")
            return "Location not available", None, None, None

        # -------- QUERY TYPES --------
        if emergency_type.lower() == "fire":
            queries = ["fire_station"]
        elif emergency_type.lower() in ["accident", "medical"]:
            queries = ["hospital", "clinic", "doctors"]
        else:
            queries = ["police"]

        overpass_url = "https://overpass-api.de/api/interpreter"

        for query in queries:
            logging.info(f"Searching Overpass for: {query}")

            overpass_query = f"""
            [out:json];
            (
              node["amenity"="{query}"](around:20000,{lat},{lon});
              way["amenity"="{query}"](around:20000,{lat},{lon});
              relation["amenity"="{query}"](around:20000,{lat},{lon});
            );
            out center;
            """

            try:
                response = requests.get(
                    overpass_url,
                    params={'data': overpass_query},
                    timeout=8
                )

                if response.status_code != 200:
                    continue

                data = response.json()
                elements = data.get("elements", [])

                if not elements:
                    continue

                def get_coords(el):
                    if "lat" in el and "lon" in el:
                        return el["lat"], el["lon"]
                    elif "center" in el:
                        return el["center"]["lat"], el["center"]["lon"]
                    return None, None

                valid_places = []
                for el in elements:
                    el_lat, el_lon = get_coords(el)
                    if el_lat and el_lon:
                        valid_places.append((el, el_lat, el_lon))

                if not valid_places:
                    continue

                closest = min(
                    valid_places,
                    key=lambda x: haversine(lat, lon, x[1], x[2])
                )

                el, c_lat, c_lon = closest
                name = el.get("tags", {}).get("name", query.title())
                distance = haversine(lat, lon, c_lat, c_lon)

                logging.info(f"Found via Overpass: {name} ({distance:.2f} km)")

                return name, c_lat, c_lon, round(distance, 2)

            except Exception as e:
                logging.error(f"Overpass error: {e}")
                continue

        # -------- 🔥 FALLBACK: NOMINATIM --------
        logging.warning("Overpass failed. Using Nominatim fallback...")

        if emergency_type.lower() == "fire":
            keyword = "fire station"
        elif emergency_type.lower() in ["accident", "medical"]:
            keyword = "hospital"
        else:
            keyword = "police station"

        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": keyword,
                "format": "json",
                "limit": 5,
                "lat": lat,
                "lon": lon
            },
            headers={"User-Agent": "AERIS-App"},
            timeout=8
        )

        results = response.json()

        if results:
            best = results[0]
            name = best.get("display_name", keyword)
            c_lat = float(best["lat"])
            c_lon = float(best["lon"])
            distance = haversine(lat, lon, c_lat, c_lon)

            logging.info(f"Found via Nominatim: {name}")

            return name, c_lat, c_lon, round(distance, 2)

        return "Emergency service nearby", lat, lon, 0

    except Exception as e:
        logging.error(f"SERVICE ERROR: {e}")
        return "Error fetching service", None, None, None

# -------------------- PREDICT API --------------------
@emergency_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        emergency = data.get("emergency", "").strip()
        lat = data.get("lat")
        lon = data.get("lon")

        logging.info(f"User location received: {lat}, {lon}")

        if not emergency:
            return jsonify({"status": "error", "message": "No emergency text provided"}), 400

        if lat is None or lon is None:
            return jsonify({"status": "error", "message": "Location not provided"}), 400

        # -------- CLEAN --------
        cleaned = clean_text(emergency)

        # -------- ML PREDICTION --------
        X_input = vectorizer.transform([cleaned])
        type_ = type_model.predict(X_input)[0]
        severity = severity_model.predict(X_input)[0]

        type_conf = float(type_model.predict_proba(X_input).max())
        severity_conf = float(severity_model.predict_proba(X_input).max())

        # -------- SUGGESTION --------
        suggestion_map = {
            "fire": "Evacuate immediately and call fire services",
            "medical": "Provide first aid and call ambulance",
            "accident": "Provide first aid and call ambulance",
            "crime": "Stay safe and contact police"
        }
        suggestion = suggestion_map.get(type_.lower(), "Stay safe and alert authorities")

        # -------- FIRST AID --------
        first_aid = get_first_aid(type_, severity)

        # -------- SERVICE --------
        service_name, s_lat, s_lon, distance = get_nearest_service(lat, lon, type_)

        # -------- SAVE TO DB --------
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

        # -------- MAP URL --------
        map_url = ""
        if s_lat and s_lon:
            map_url = f"https://www.google.com/maps/dir/?api=1&origin={lat},{lon}&destination={s_lat},{s_lon}&travelmode=driving"

        return jsonify({
            "type": type_,
            "severity": severity,
            "suggestion": suggestion,
            "first_aid": first_aid,
            "service_name": service_name,
            "distance_km": distance,
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