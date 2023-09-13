from image_embedder import image_embedding
from sanic import Sanic
from sanic.response import json
import base64
import cv2
import numpy as np

app = Sanic("image_segmentation")

@app.post('/training')
def compare_picture(request):
    try:
        submission = request.json
        encoded_img = submission['submission'].split(',')[1]
        decoded_img = base64.b64decode(encoded_img)
        nparr = np.frombuffer(decoded_img, np.uint8)
        img = cv2.imdecode(nparr, 1)
        submitted_image = img
        challenge_image= f"challenge_photos/challenge-{submission['challenge']}.png"
        result = image_embedding(submitted_image,challenge_image)
        score = round(result*100)
        return json({"success": True, "score": score})
    except Exception as error:
        print(error)
        return json({"success": False})

@app.post('/count-down')
def compare_picture_set(request):
    try:
        submission_set = request.json
        total_score = 0
        for index, submission in enumerate(submission_set):
            encoded_img = submission_set[submission].split(',')[1]
            decoded_img = base64.b64decode(encoded_img)
            nparr = np.frombuffer(decoded_img, np.uint8)
            img = cv2.imdecode(nparr, 1)
            submitted_image=img
            challenge_image = f"challenge_photos/challenge-{index + 1}.png"
            result = image_embedding(submitted_image,challenge_image)
            score = result/5
            total_score += round(score*100)
        return json({"success": True, "score": total_score})
    except:
        return json({"success": False})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, single_process=False)