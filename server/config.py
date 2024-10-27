from flask import Flask
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()

def create_app():
    
    app = Flask(__name__)
    CORS(app)
    from routes import setup_routes
    setup_routes(app)  

    return app