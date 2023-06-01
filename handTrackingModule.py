import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import math

class handDetector():
    def __init__(
            self,
            mode=False,
            max_hands=2,
            model_complexity=1,
            detection_confidence=0.5,
            track_confidence=0.5
        ):
        self.mode = mode
        self.max_hands = max_hands
        self.model_complexity = model_complexity
        self.detection_confidence = detection_confidence
        self.track_confidence = track_confidence

        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(self.mode, self.max_hands, self.model_complexity, self.detection_confidence, self.track_confidence)
    
    def findPosition(self, img):
        hands_list = []
        self.hands_list_in_pixel = []
        # self.lms_list_in_pixel = []
        # Convert to rgb image for detection
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # hand detection
        self.results = self.hands.process(imgRGB)
        if self.results.multi_hand_landmarks:
            for hand in self.results.multi_hand_landmarks: # For each hand detected
                lms_list = []
                lms_list_in_pixel = []
                for id, lm in enumerate(hand.landmark): # Finger landmarks
                    height, width, channel = img.shape
                    cx, cy = int(lm.x*width), int(lm.y*height)
                    lms_list_in_pixel.append([id, cx, cy])
                    lms_list.append({"x": lm.x, "y": lm.y, "z": lm.z})
                hands_list.append(lms_list)
                self.hands_list_in_pixel.append(lms_list_in_pixel)
        return hands_list, self.hands_list_in_pixel
    def enable_draw(self):
        check_result = {"check": False, "hands_lms_list": []}
        if (len(self.hands_list_in_pixel)):
            for hand in self.hands_list_in_pixel:
                index_x, index_y = hand[8][1], hand[8][2]
                thumb_x, thumb_y = hand[4][1], hand[4][2]
                fingers_distance_in_pixel = math.hypot(index_x - thumb_x, index_y - thumb_y)
                if fingers_distance_in_pixel < 50:
                    check_result["check"] = True
                    centre_x = (index_x + thumb_x) / 2
                    centre_y = (index_y + thumb_y) / 2
                    check_result['hands_lms_list'].append({
                        "centre_XY": [centre_x, centre_y],
                        "index_XY": [index_x, index_y],
                        "thumb_XY": [thumb_x, thumb_y]
                        })
                    # check_result["centre_XY"] = [centre_x, centre_y]
                    # check_result["index_XY"] = [index_x, index_y]
                    # check_result["thumb_XY"] = [thumb_x, thumb_y]
            print(len(check_result['hands_lms_list']))
        return check_result