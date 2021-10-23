import configparser
from decoder import TrieDecoder
from flask import Flask, request
import json
import numpy as np
from punctuator import Punctuator


punctuator = Punctuator(model_path="data/punctuator")

app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data["text"]
    result = punctuator.predict(text)

    return json.dumps(result, ensure_ascii=False)
