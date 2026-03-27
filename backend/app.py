from flask import Flask
from flask_cors import CORS
import nltk
import os
import logging

from routes.emergency_routes import emergency_bp
from database.db import init_db

logging.basicConfig(level=logging.INFO)

# Download stopwords if not present
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)
app.config["JSON_SORT_KEYS"] = False
app.config["ENV"] = os.environ.get("FLASK_ENV", "development")
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", True)

# Init DB
init_db()

# Register routes
app.register_blueprint(emergency_bp, url_prefix="/api")

@app.route("/")
def home():
    return {
        "status": "AERIS backend running 🚀",
        "version": "1.0",
        "apis": ["/api/predict"]
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=port)