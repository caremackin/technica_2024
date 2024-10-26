from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
import string
from keybert import KeyBERT
model = KeyBERT('distilbert-base-nli-mean-tokens')
from bertopic import BERTopic
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

def get_key_words(text):
    keywords = model.extract_keywords(text)
    # Print the keywords
    print("Keywords:")
    for keyword in keywords:
        print(keyword)

if __name__ == "__main__":
    example_text = "This is a sample sentence and we are going to remove the stopwords from this."
    get_key_words(example_text)