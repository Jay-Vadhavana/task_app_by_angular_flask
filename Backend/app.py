from flask import Flask
from models.task import db
from resources.task_resources import api_bp
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Recommended for SQLAlchemy
CORS(app, origins=["https://taupe-semolina-76b31f.netlify.app"])  # Enable CORS for all routes

db.init_app(app)
app.register_blueprint(api_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
    app.run(debug=True)