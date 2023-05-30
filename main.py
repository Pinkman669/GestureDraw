from sanic import Sanic
from sanic.response import json
import base64
import cv2
import numpy as np
import FingersClick
from memory_profiler import profile
import handTrackingModule as htm

app = Sanic("project")

# Hand detecetor
detector = htm.handDetector(detection_confidence=0.7)

@app.post('/')
def test(request):
    try:
        frame = request.json
        encoded_frame = frame['frame'].split(',')[1]
        decoded_frame = base64.b64decode(encoded_frame)
        nparr = np.frombuffer(decoded_frame, np.uint8)
        img = cv2.imdecode(nparr, 1)
        img = FingersClick.detectHands(detector, img)
        img = cv2.imencode('.jpg', img)[1]
        encoded_img = base64.b64encode(img).decode()
        return json({"frame": encoded_img})
    except:
        print('no')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=False)