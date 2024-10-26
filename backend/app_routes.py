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

# def setup_provider_routes(app):

#     # Route to retrieve all providers or providers based on given filters
#     # core filters are tags and rating
#     # but also enables other filter options like sorted by name, rating, virtual/in-person etc.
#     @app.route("/providers", methods=["GET"])
#     def filter_providers():

def get_key_words(text):
    keywords = model.extract_keywords(text)
    # Print the keywords
    print("Keywords:")
    for keyword in keywords:
        print(keyword)

def get_google_images(query, num_images=5):
    # Set your API key and Search Engine ID
    api_key = 'AIzaSyD3ma4mpbVJ5hNhNOKn3QdhiEOztn-AkYE'  # Replace with your actual API key
    search_engine_id = 'a1c8f1503f5e248bb'  # Replace with your actual Search Engine ID
    
    # Define the API endpoint
    url = 'https://www.googleapis.com/customsearch/v1'
    
    # Set up the parameters for the search
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


if __name__ == "__main__":
    example_text = "This is a sample sentence and we are going to remove the stopwords from this."
    get_key_words(example_text)

    query = "cats"
    images = get_google_images(query)

    print("Image URLs:", images)


#AIzaSyD3ma4mpbVJ5hNhNOKn3QdhiEOztn-AkYE`