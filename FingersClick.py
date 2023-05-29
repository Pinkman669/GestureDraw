import cv2
import time
import numpy as np
import handTrackingModule as htm
import math

def main():
    # camera width and height
    width_cam, height_cam = 640, 480

    # Configure camera settings
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(3, width_cam) # index refer to VideoCaptureProperties
    cap.set(4, height_cam)
    c_time = 0
    p_time = 0
    detector = htm.handDetector(detection_confidence=0.7)

    while True:
        c_time = time.time()
        fps = 1 / (c_time-p_time)
        p_time = c_time

        success, img = cap.read()
        img = detector.findHands(img)
        lms_list = detector.findPosition(img, draw=False)
        if len(lms_list):
            thumb_x, thumb_y = lms_list[4][1], lms_list[4][2]
            index_x, index_y = lms_list[8][1], lms_list[8][2]
            centre_x, centre_y = (thumb_x + index_x)//2, (thumb_y + index_y)//2

            cv2.circle(img, (centre_x, centre_y), 7, (255,0,255), cv2.FILLED)
            cv2.line(img, (thumb_x, thumb_y), (index_x, index_y), (255,0,255), 1)

            fingers_distance = math.hypot(index_x - thumb_x, index_y - thumb_y)
            if (fingers_distance < 50):
                cv2.circle(img, (centre_x, centre_y), 7, (255,0,0), cv2.FILLED)

        cv2.putText(img, f'FPS: {int(fps)}', (30, 30), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255), 3)
        cv2.imshow("img", img)

        print(type(img))

        if cv2.waitKey(1) == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break

if __name__ == "__main__":
    main()