from keybert import KeyBERT
model = KeyBERT('distilbert-base-nli-mean-tokens')
from bertopic import BERTopic
import requests
from flask import request, jsonify
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os
import random
from transformers import pipeline
from googletrans import Translator


load_dotenv()

SEARCH_ENGINE_ID = os.getenv('SEARCH_ENGINE_ID')
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def set_app_routes(app):
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"hello":"word"}), 200
    
  
    @app.route('/translate', methods=['POST'])
    def translate():
        data = request.get_json()
        keywords = data.get("keywords", [])  
        translated_words = []
        
        translator = Translator()

        for keyword in keywords:
            try:
                translated = translator.translate(keyword, dest='es')
                if translated is not None:
                    translated_words.append(translated.text) 
                    print(f'Translated "{keyword}" to "{translated.text}"')
                else:
                    print(f'No translation found for "{keyword}"')
            except Exception as e:
                print(f'Error translating "{keyword}": {e}')
                translated_words.append('')  

        return jsonify({"translation": translated_words}), 201


    @app.route('/search', methods=['POST'])
    def search_youtube():
        data = request.get_json()
        keywords = data.get("keywords")
        keyVideos =[]
        if not keywords:
            return jsonify({"error": "Query parameter is required"}), 400
        for query in keywords:
            url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&key={YOUTUBE_API_KEY}'
            
            response = requests.get(url)
            print(response)
            
            if response.status_code != 200:
                return jsonify({"error": "Failed to fetch data from YouTube API"}), response.status_code
            data = response.json()
            # Extract relevant information from the response
            videos = []
            for item in data.get('items', [])[:1]:  # Limit to 2 items
                if item['id']['kind'] == 'youtube#video':  
                    videos.append({
                        'title': item['snippet']['title'],
                        'videoId': item['id']['videoId'],
                        'description': item['snippet']['description'],
                        'thumbnail': item['snippet']['thumbnails']['default']['url']
                    })
            keyVideos += videos
        return jsonify(keyVideos)



    @app.route("/summary", methods=["POST"])
    def summarization():
        data = request.get_json()
        article = data.get("text")
        summary = summarizer(article, max_length=200, min_length=30)
        return jsonify({"summary": summary})

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
        for word in keywords:
            url_list += get_google_images(word, 1)

        complete_tuple = tuple(zip(tuple(keywords), tuple(url_list)))
        
        return jsonify({"urls": complete_tuple}), 201
    
    @app.route("/regenImage", methods=["POST"])
    def regen_image_from_keyword():
        data = request.get_json()
        keyword=data.get("keyword")
        url_list = []
        url_list += get_google_images(keyword, 5)
        print(url_list)
        image_selected = random.choice(url_list)
    
        complete_response = {
            "keyword": keyword,
            "image_url": image_selected
        }
    
        return jsonify(complete_response), 201
        

    def get_google_images(query, num_images):
        api_key = YOUTUBE_API_KEY
        search_engine_id = SEARCH_ENGINE_ID
        
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



