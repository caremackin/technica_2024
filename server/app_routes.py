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
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os
import random


load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')


def get_access_token():
    response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    )
    response_data = response.json()
    return response_data['access_token']



def set_app_routes(app):

    @app.route('/search', methods=['POST'])
    def search_youtube():
        # Get the search query from query parameters
        data = request.get_json()
        keywords = data.get("keywords")
        keyVideos =[]

        if not keywords:
            return jsonify({"error": "Query parameter is required"}), 400

        for query in keywords:
            # YouTube API endpoint for search
            url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&key={YOUTUBE_API_KEY}'
            
            # Make a request to the YouTube API
            response = requests.get(url)
            
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





    # @app.route('/search_podcasts/<keyword>', methods=['GET'])
    # def search_podcasts(keyword):
    #     access_token = get_access_token()
    #     headers = {
    #         'Authorization': f'Bearer {access_token}'
    #     }
        
    #     params = {
    #         'q': f'episode:{keyword}',  # Try different formats if needed
    #         'type': 'track ',
    #         'limit': 20,
    #         'offset': 0
    #     }
        
    #     all_episodes = []
        
    #     while True:
    #         response = requests.get('https://api.spotify.com/v1/search', headers=headers, params=params)
    #         data = response.json()
            
    #         print(f"Request URL: {response.url}")  # Print the request URL for debugging
    #         print(f"Response Data: {data}")  # Print the entire response data
            
    #         all_episodes.extend(data['episodes']['items'])

    #         if data['episodes']['next']:
    #             params['offset'] += params['limit']  # Update offset for the next request
    #         else:
    #             break  # Exit loop if no more pages
        
    #     return all_episodes


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

