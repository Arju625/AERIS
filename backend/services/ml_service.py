import joblib
import re
import nltk
from nltk.corpus import stopwords
import os

nltk.download('stopwords')

# Load models once


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

emergency_model = joblib.load(os.path.join(BASE_DIR, "models/emergency_model.pkl"))
emergency_vectorizer = joblib.load(os.path.join(BASE_DIR, "models/tfidf_vectorizer.pkl"))

severity_model = joblib.load(os.path.join(BASE_DIR, "models/severity_model.pkl"))
severity_vectorizer = joblib.load(os.path.join(BASE_DIR, "models/severity_vectorizer.pkl"))

response_map = {
    "fire": {
        "low": "Use fire extinguisher if small. Stay alert.",
        "medium": "Evacuate area and call fire service.",
        "high": "Immediate evacuation! Call fire department now!"
    },
    "accident": {
        "low": "Check for minor injuries and apply first aid.",
        "medium": "Call ambulance and assist injured persons.",
        "high": "Serious injuries detected! Call emergency services immediately!"
    },
    "flood": {
        "low": "Move valuables to higher place.",
        "medium": "Move to safe location.",
        "high": "Evacuate immediately to higher ground!"
    },
    "medical": {
        "low": "Monitor patient condition.",
        "medium": "Provide first aid and call doctor.",
        "high": "Critical condition! Call ambulance immediately!"
    }
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    words = text.split()
    words = [w for w in words if w not in stopwords.words('english')]
    return " ".join(words)

def predict_emergency(text):
    cleaned = clean_text(text)

    emergency_pred = emergency_model.predict(
        emergency_vectorizer.transform([cleaned])
    )[0]

    severity_pred = severity_model.predict(
        severity_vectorizer.transform([cleaned])
    )[0]

    emergency = emergency_pred.lower()
    severity = severity_pred.lower()

    suggestion = response_map.get(emergency, {}).get(
        severity,
        "Stay safe and contact emergency services immediately."
    )

    return emergency_pred, severity_pred, suggestion