from flask import Flask
from flask_cors import CORS
import nltk
import os
import logging

from routes.emergency_routes import emergency_bp
from database.db import init_db

logging.basicConfig(level=logging.INFO)

# -------- NLTK --------
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading NLTK stopwords...")
    nltk.download('stopwords')

app = Flask(__name__)

# -------- CONFIG --------
app.config["JSON_SORT_KEYS"] = False
app.config["ENV"] = os.environ.get("FLASK_ENV", "development")
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", "True") == "True"

# -------- CORS --------
CORS(app, resources={r"/api/*": {"origins": "*"}})

# -------- DB --------
init_db()

# -------- ROUTES --------
app.register_blueprint(emergency_bp, url_prefix="/api")

@app.route("/")
def home():
    return {
        "status": "AERIS backend running 🚀",
        "version": "1.0",
        "apis": ["/api/predict"]
    }

@app.route("/health")
def health():
    return {"status": "ok"}

# -------- ERROR HANDLING --------
@app.errorhandler(404)
def not_found(e):
    return {"error": "Route not found"}, 404

@app.errorhandler(500)
def server_error(e):
    return {"error": "Internal server error"}, 500

# -------- RUN --------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=port)