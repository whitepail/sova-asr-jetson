import numpy as np
import argparse
import configparser
import json
from data_loader import load_audio, preprocess
from decoder import GreedyDecoder
from vad import VAD
from pydub import AudioSegment
from io import BytesIO
from multiprocessing.pool import ThreadPool
from requests import request


class SpeechRecognizer(object):
    def __init__(self, config_path='config.ini'):
        if config_path is None:
            raise Exception('Path to config file is None')
        self.config = configparser.ConfigParser()
        self.config.read(config_path, encoding='UTF-8')
        self.labels = self.config['Wav2Letter']['labels'][1:-1]
        self.sample_rate = int(self.config['Wav2Letter']['sample_rate'])
        self.window_size = float(self.config['Wav2Letter']['window_size'])
        self.window_stride = float(self.config['Wav2Letter']['window_stride'])
        self.greedy = int(self.config['Wav2Letter']['greedy'])
        self.cpu = int(self.config['Wav2Letter']['cpu'])
        self.vad = VAD(
            mode=int(self.config['Wav2Letter']['vad_aggressiveness_mode']),
            frame_duration_ms=int(self.config['Wav2Letter']['vad_frame_duration_ms']),
            max_pause_ms=int(self.config['Wav2Letter']['vad_max_pause_ms'])
        )

        if self.cpu:
            from PuzzleLib import Config
            Config.backend = Config.Backend.cpu

        from PuzzleLib.Models.Nets.WaveToLetter import loadW2L
        from PuzzleLib.Modules import MoveAxis

        nfft = int(self.sample_rate * self.window_size)
        self.w2l = loadW2L(modelpath=self.config['Wav2Letter']['model_path'], inmaps=(1 + nfft // 2),
                           nlabels=len(self.labels))
        self.w2l.append(MoveAxis(src=2, dst=0))

        if not self.cpu:
            self.w2l.calcMode(np.float16)

        self.w2l.evalMode()

        if not self.greedy:
            # from decoder import TrieDecoder
            # lexicon = self.config['Wav2Letter']['lexicon']
            # tokens = self.config['Wav2Letter']['tokens']
            # lm_path = self.config['Wav2Letter']['lm_path']
            # beam_threshold = float(self.config['Wav2Letter']['beam_threshold'])
            # self.decoder = TrieDecoder(lexicon, tokens, lm_path, beam_threshold)
            self.decoder_url = "http://localhost:8889/decode"
        else:
            self.decoder = GreedyDecoder(self.labels)

    def decode_request(self, args):
        outputs, start_timestamp = args
        data = {
            "outputs": outputs.tolist(),
            "start_timestamp": start_timestamp
        }

        response = request("POST", self.decoder_url, json=data)

        result = json.loads(response.text)

        return result


    def recognize(self, audio_path, max_chunk_len=30000):
        results = []
        inputs = []
        outputs = []

        audio = load_audio(audio_path, self.sample_rate).raw_data
        segments = self.vad.collect(audio, self.sample_rate)
        start_timestamps = []
        current_timestamp = 0.0

        for segment in segments:
            start, end = segment.get()
            start_timestamps.append(current_timestamp)

            sound = AudioSegment.from_raw(
                BytesIO(audio[start:end]), sample_width=2, frame_rate=self.sample_rate, channels=1
            )
            current_timestamp += sound.duration_seconds

            audio_segment = np.array(sound.get_array_of_samples()).astype(float)

            preprocessed_audio = preprocess(audio_segment, self.sample_rate, self.window_size, self.window_stride)

            chunk_outputs = []
            for i in range(1 + preprocessed_audio.shape[1] // max_chunk_len):
                audio_chunk = preprocessed_audio[::, i * max_chunk_len:(i + 1) * max_chunk_len]

                if self.cpu:
                    from PuzzleLib.CPU.CPUArray import CPUArray
                    inputs = CPUArray.toDevice(np.array([audio_chunk]).astype(np.float32))
                else:
                    from PuzzleLib.Backend import gpuarray
                    inputs = gpuarray.to_gpu(np.array([audio_chunk]).astype(np.float16))

                chunk_outputs.append(self.w2l(inputs).get())

            outputs.append(np.vstack(chunk_outputs))

        if not self.cpu:
            from PuzzleLib.Backend.gpuarray import memoryPool
            memoryPool.freeHeld()

        if self.greedy:
            pool = ThreadPool(processes=4)
            results = pool.map(
                self.decoder.decode,
                zip([np.vstack(output).astype(np.float32) for output in outputs], start_timestamps)
            )
            results = [
                {
                    "text": result.text,
                    "score": result.score,
                    "words": result.words
                } for result in results
            ]
        else:
            pool = ThreadPool(processes=4)
            results = pool.map(
                self.decode_request,
                zip([np.vstack(output).astype(np.float32) for output in outputs], start_timestamps)
            )

        if inputs:
            del inputs
        if outputs:
            del outputs

        return results


def test():
    parser = argparse.ArgumentParser(description='Pipeline')
    parser.add_argument('--audio', default='data/test.wav', metavar='DIR', help='Path to wav file')
    parser.add_argument('--config', default='config.ini', help='Path to config')
    args = parser.parse_args()

    recognizer = SpeechRecognizer(args.config)

    print(recognizer.recognize(args.audio))


if __name__ == "__main__":
    test()
