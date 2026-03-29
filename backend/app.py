from flask import Flask
from flask_cors import CORS
import nltk
import os
import logging
from dotenv import load_dotenv
load_dotenv()

from routes.emergency_routes import emergency_bp
from routes.auth_routes import auth_bp
from database.db import init_db

# -------------------- LOGGING --------------------
logging.basicConfig(level=logging.INFO)

# -------------------- NLTK STOPWORDS --------------------
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# -------------------- FLASK APP --------------------
app = Flask(__name__)

# -------------------- CORS --------------------
# Only allow local dev domains; remove Shiny Goldfish references
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173"
], supports_credentials=True)

# -------------------- CONFIG --------------------
app.config["JSON_SORT_KEYS"] = False
app.config["ENV"] = os.environ.get("FLASK_ENV", "development")
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", "True") == "True"

# -------------------- DATABASE INIT --------------------
init_db()

# -------------------- BLUEPRINTS --------------------
app.register_blueprint(emergency_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/auth")

# -------------------- ROOT ROUTE --------------------
@app.route("/")
def home():
    return {
        "status": "AERIS backend running 🚀",
        "version": "1.0",
        "apis": ["/api/predict", "/auth/login", "/auth/signup", "/auth/profile"]
    }

# -------------------- MAIN --------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=port)