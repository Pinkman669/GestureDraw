import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import time

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


def main():
    previous_time = 0
    count_time = 0
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 640)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)

    detector = handDetector()

    while cap.isOpened():
        success, img = cap.read()
        img = detector.findHands(img)
        img, lms_list = detector.findPosition(img)
        if len(lms_list):
            print(lms_list[8]) # index 8 is tip of index finger

        count_time = time.time()
        fps = 1/(count_time - previous_time)
        previous_time = count_time

        cv2.putText(img, str(int(fps)), (10,70), cv2.FONT_HERSHEY_PLAIN, 3, (255,255,255), 3)
        cv2.imshow("Image", img)
        if cv2.waitKey(1) == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break

if __name__ == "__main__":
    main()