# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize
# import re
# import string
import nltk
from nltk.tokenize import sent_tokenize
from keybert import KeyBERT
model = KeyBERT('distilbert-base-nli-mean-tokens')
from bertopic import BERTopic
import requests
from flask import request, jsonify



def set_app_routes(app):
    @app.route("/", methods=["GET"])
    def home():
       return jsonify({"hello":"word"}), 200

    @app.route("/keywords", methods=["POST"])
    def get_key_words():
        data = request.get_json()
        print("DATA:")
        print(data)
        if not data or "text" not in data:
            return jsonify({"error": "Invalid input, 'text' key is required"}), 400
        text = data.get("text")
        print("TEXT")
        print(text)
        keywords_with_scores = model.extract_keywords(text, top_n=10)
        keywords = [keyword for keyword, score in keywords_with_scores]

        print("Keywords:")
        for keyword in keywords:
            print(keyword)
        return jsonify({"keywords":keywords})

    @app.route("/images", methods=["POST"])
    def get_images_from_keywords():
        data = request.get_json()
        keywords=data.get("keywords")
        url_list = []
        if len(keywords) > 3:
            for word in keywords:
                url_list += get_google_images(word, 1)
        else:
            for word in keywords:
                url_list += get_google_images(word, 2)
        
        return jsonify({"urls": url_list}), 201

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

