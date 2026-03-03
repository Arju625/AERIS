from flask import Flask
from backend.routes.emergency_routes import emergency_bp
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.register_blueprint(emergency_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)