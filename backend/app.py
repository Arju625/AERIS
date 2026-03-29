from flask import Flask
from flask_cors import CORS
import nltk
import os
import logging

from routes.emergency_routes import emergency_bp
from routes.auth_routes import auth_bp
from database.db import init_db

logging.basicConfig(level=logging.INFO)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)

CORS(app, origins=[
    "https://shiny-goldfish-4j7xv94r4g452qq5p-3000.app.github.dev",
    "https://shiny-goldfish-4j7xv94r4g452qq5p-5173.app.github.dev",
    "http://localhost:3000",
    "http://localhost:5173"
], supports_credentials=True)

app.config["JSON_SORT_KEYS"] = False
app.config["ENV"] = os.environ.get("FLASK_ENV", "development")
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", True)

init_db()

app.register_blueprint(emergency_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/auth")

@app.route("/")
def home():
    return {
        "status": "AERIS backend running 🚀",
        "version": "1.0",
        "apis": ["/api/predict", "/auth/login", "/auth/signup", "/auth/profile"]
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=port)
