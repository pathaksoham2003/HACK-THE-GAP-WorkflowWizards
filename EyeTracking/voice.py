import pyaudio
import numpy as np
import pyttsx3

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Adjust speaking speed

# Set parameters
CHUNK = 1024  # Buffer size
FORMAT = pyaudio.paInt16  # Audio format (16-bit PCM)
CHANNELS = 1  # Mono audio
RATE = 44100  # Sample rate
THRESHOLD = 1500  # Volume threshold for speaking detection

# Initialize PyAudio
audio = pyaudio.PyAudio()

# Open microphone stream
stream = audio.open(format=FORMAT, channels=CHANNELS,
                    rate=RATE, input=True,
                    frames_per_buffer=CHUNK)

print("Listening for voice activity...")

while True:
    data = stream.read(CHUNK, exception_on_overflow=False)
    audio_data = np.frombuffer(data, dtype=np.int16)
    
    volume = np.max(np.abs(audio_data))  # Measure volume level
    
    if volume > THRESHOLD:
        print("Voice detected! Asking user to stop using audio devices.")
        engine.say("Please stop using audio devices while taking the exam.")
        engine.runAndWait()  # Speak the message

# Cleanup (unreachable due to infinite loop)
stream.stop_stream()
stream.close()
audio.terminate()
