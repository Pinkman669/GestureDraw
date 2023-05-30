import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import time
from memory_profiler import profile

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
        self.mp_draw = mp.solutions.drawing_utils
    def findHands(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)
        if self.results.multi_hand_landmarks and draw: # if hands recognized
            for hand_lms in self.results.multi_hand_landmarks: # for each hand
                self.mp_draw.draw_landmarks(img, hand_lms, self.mp_hands.HAND_CONNECTIONS)
        return img
    def findPosition(self, img, hand_num=0, draw=True):
        lm_list = []
        
        if self.results.multi_hand_landmarks:
            my_hand = self.results.multi_hand_landmarks[hand_num]
            for id, lm in enumerate(my_hand.landmark): # Finger landmarks
                height, width, channel = img.shape
                cx, cy = int(lm.x*width), int(lm.y*height)
                #cv2.putText(img, str(id), (cx,cy), cv2.FONT_HERSHEY_PLAIN, 2, (50,50,50), 2) # Mark index on each landmark
                lm_list.append([id, cx, cy])
                if id == 8:
                    if draw:
                        cv2.circle(img, (cx,cy), 10, (234, 221, 202), cv2.FILLED) 
        return lm_list