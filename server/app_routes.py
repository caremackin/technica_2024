from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
import string
from keybert import KeyBERT
model = KeyBERT('distilbert-base-nli-mean-tokens')
# from bertopic import BERTopic
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO
from flask import request, jsonify
from config import db

def set_app_routes(app):
    @app.route("/keywords", methods=["GET"])
    def get_key_words(text):
        keywords = model.extract_keywords(text)
        print("Keywords:")
        for keyword in keywords:
            print(keyword)

def get_google_images(query, num_images=5):
    api_key = 'AIzaSyD3ma4mpbVJ5hNhNOKn3QdhiEOztn-AkYE'  
    search_engine_id = 'a1c8f1503f5e248bb'
    
    url = 'https://www.googleapis.com/customsearch/v1'
    params = {
        'q': query,
        'cx': search_engine_id,
        'key': api_key,
        'searchType': 'image',  
        'num': num_images, 
    }
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        results = response.json()
        image_urls = [item['link'] for item in results.get('items', [])]
        return image_urls
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return []

