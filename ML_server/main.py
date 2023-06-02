from sanic import Sanic
from sanic.response import json
import base64
import cv2
import numpy as np
import handTrackingModule as htm

app = Sanic("project")

# Hand detecetor
detector = htm.handDetector()

@app.post('/')
def test(request):
    try:
        frame = request.json
        encoded_frame = frame['frame'].split(',')[1]
        decoded_frame = base64.b64decode(encoded_frame)
        nparr = np.frombuffer(decoded_frame, np.uint8)
        img = cv2.imdecode(nparr, 1)
        hands_list, lms_list_in_pixel = detector.findPosition(img)
        check_result = detector.enable_draw()
        return json({"landmarks_in_pixel": lms_list_in_pixel, "landmarks": hands_list, "enable_draw": check_result})
    except:
        print('no')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=False)