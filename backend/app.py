from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/auth/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register the blueprint
from auth import auth_bp  # Import your blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')  # Add url_prefix 

@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data()) 