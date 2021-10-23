import configparser
from decoder import TrieDecoder
from flask import Flask, request
import json
import numpy as np


config = configparser.ConfigParser()
config.read("config.ini", encoding="UTF-8")
lexicon = config["Wav2Letter"]["lexicon"]
tokens = config["Wav2Letter"]["tokens"]
lm_path = config["Wav2Letter"]["lm_path"]
beam_threshold = float(config["Wav2Letter"]["beam_threshold"])
decoder = TrieDecoder(lexicon, tokens, lm_path, beam_threshold)

app = Flask(__name__)


@app.route("/decode", methods=["POST"])
def decode():
    data = request.json
    outputs = np.array(data["outputs"])
    result = decoder.decode(outputs, start_timestamp=data["start_timestamp"])

    results = {
        "text": result.text,
        "score": result.score,
        "words": result.words
    }

    return json.dumps(results, ensure_ascii=False)
