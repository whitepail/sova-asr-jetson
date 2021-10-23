import webrtcvad


class AudioSegment:
    def __init__(self, start, end, frame_size):
        self.start, self.end = start, end
        self.frame_size = frame_size


    def get(self):
        return self.start * self.frame_size, self.end * self.frame_size


class RingBuffer:
    def __init__(self, log2_size, trigger_threshold):
        self.size = 1 << log2_size
        self.mask = self.size - 1

        self.buffer = [False] * self.size
        self.threshold = trigger_threshold * self.size

        self.offset, self.curr_threshold = 0, 0


    def append(self, flag):
        prev_flag, self.buffer[self.offset] = self.buffer[self.offset], flag
        self.offset = (self.offset + 1) & self.mask

        if prev_flag != flag:
            self.curr_threshold += 1 if flag else -1


    def is_full(self):
        return self.curr_threshold > self.threshold


    def is_empty(self):
        return self.curr_threshold == 0


    def clear(self):
        self.buffer = [False] * self.size
        self.offset, self.curr_threshold = 0, 0


class VAD:
    def __init__(self, mode, frame_duration_ms, max_pause_ms):
        self.vad = webrtcvad.Vad(mode)
        self.frame_duration_ms, self.max_pause_ms = frame_duration_ms, max_pause_ms


    def collect(self, audio, sample_rate, buffer_log2_size=5, trigger_threshold=0.9):
        ring_buffer = RingBuffer(log2_size=buffer_log2_size, trigger_threshold=trigger_threshold)
        voiced = False

        frame_size = int(sample_rate * (self.frame_duration_ms / 1000) * 2)
        nframes = len(audio) // frame_size

        segments = []
        segment_start = 0

        for i in range(nframes):
            frame = audio[i * frame_size:(i + 1) * frame_size]

            if not voiced:
                ring_buffer.append(self.vad.is_speech(frame, sample_rate))

                if ring_buffer.is_full():
                    if len(segments) == 0:
                        segments.append(AudioSegment(start=segment_start, end=i + 1, frame_size=frame_size))

                    else:
                        pause_length = i + 1 - segment_start

                        pause_start = pause_length // 2
                        pause_end = pause_length - pause_start

                        segments[-1].end += pause_start

                        if pause_length > self.max_pause_ms / self.frame_duration_ms:
                            segments.append(AudioSegment(
                                start=segment_start + pause_start, end=segment_start + pause_length,
                                frame_size=frame_size
                            ))
                        else:
                            segments[-1].end += pause_end

                    voiced = True
                    ring_buffer.clear()

            else:
                ring_buffer.append(not self.vad.is_speech(frame, sample_rate))

                if ring_buffer.is_full():
                    segments[-1].end = segment_start = i + 1

                    voiced = False
                    ring_buffer.clear()

        if voiced:
            segments[-1].end = nframes

        return segments


    def is_speech(self, audio, sample_rate):
        return self.vad.is_speech(audio, sample_rate)
