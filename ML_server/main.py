from sanic import Sanic
from sanic.response import json
import base64
import cv2
import numpy as np
import handTrackingModule as htm

app = Sanic("project")

# Hand detecetor
detector = htm.handDetector(detection_confidence=0.85)

@app.post('/')
def drawing(request):
    try:
        frame = request.json
        encoded_frame = frame['frame'].split(',')[1]
        decoded_frame = base64.b64decode(encoded_frame)
        nparr = np.frombuffer(decoded_frame, np.uint8)
        img = cv2.imdecode(nparr, 1)
        hands_list, lms_list_in_pixel = detector.findPosition(img)
        check_result = detector.enable_draw()
        fingers_up = detector.count_fingers_up()
        return json({"landmarks_in_pixel": lms_list_in_pixel, "landmarks": hands_list, "enable_draw": check_result, "fingers_up": fingers_up})
    except:
        print('no')

@app.post('/training')
def compare_picture(request):
    try:
        submission = request.json
        encoded_img = submission['submission'].split(',')[1]
        decoded_img = base64.b64decode(encoded_img)
        nparr = np.frombuffer(decoded_img, np.uint8)
        img = cv2.imdecode(nparr, 1)
        cv2.imwrite('submission.jpg', img)
        return json({"success": True})
    except:
        print('error!')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=False)