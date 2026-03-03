from flask import Blueprint, request, jsonify
from backend.services.ml_service import predict_emergency
from backend.services.location_service import find_nearest

emergency_bp = Blueprint("emergency", __name__)

@emergency_bp.route("/predict", methods=["POST"])
def predict():

    data = request.json

    user_text = data.get("emergency")
    user_lat = float(data.get("lat"))
    user_lon = float(data.get("lon"))

    emergency_pred, severity_pred, suggestion = predict_emergency(user_text)

    emergency = emergency_pred.lower()

    if emergency == "fire":
        nearest = find_nearest("fire", user_lat, user_lon)
    elif emergency in ["accident", "medical"]:
        nearest = find_nearest("hospital", user_lat, user_lon)
    else:
        nearest = find_nearest("police", user_lat, user_lon)

    if nearest:
        name, lat, lon, distance = nearest
        route_url = f"https://www.google.com/maps/dir/{user_lat},{user_lon}/{lat},{lon}"
        map_url = f"https://www.google.com/maps?q={lat},{lon}&output=embed"
    else:
        name = "Not available"
        distance = "N/A"
        route_url = ""
        map_url = ""

    return jsonify({
        "type": emergency_pred,
        "severity": severity_pred,
        "suggestion": suggestion,
        "nearest_service": name,
        "distance_km": distance,
        "route_url": route_url,
        "map_url": map_url,
        "high_alert": severity_pred.lower() == "high"
    })