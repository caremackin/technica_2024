from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# for adding cors
# from flask_cors import CORS  # Import CORS if you need it

load_dotenv()

# Initialize the database
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # CORS(app)

    from routes import setup_routes
    setup_routes(app)  

    return app