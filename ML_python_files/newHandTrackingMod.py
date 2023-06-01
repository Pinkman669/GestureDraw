import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2

model_path = "./model/hand_landmarker.task"

BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

class handDetector():
    def __init__(
            self,
            running_mode = VisionRunningMode.IMAGE,
            num_hands = 2,
            min_hand_detection_confidence = 0.5,
            min_hand_presence_confidence = 0.5,
            min_tracking_confidence = 0.5
        ):
        self.BaseOptions = BaseOptions(model_asset_path=model_path)
        self.options = HandLandmarkerOptions(
            base_options=self.BaseOptions,
            running_mode=running_mode,
            num_hands=num_hands,
            min_hand_detection_confidence=min_hand_detection_confidence,
            min_hand_presence_confidence=min_hand_presence_confidence,
            min_tracking_confidence=min_tracking_confidence,
            )

        self.mp_hands = HandLandmarker.create_from_options(self.options)
    def findHands(self, img):
        # Change to mp.image for mp detection
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=img)
        # Detect img
        self.result = self.mp_hands.detect(mp_img)
        lms_list = []
        lms_list_in_pixel = []
        if self.result.handedness:
            # for each hands landmarks
            for id,hand_lms in enumerate(self.result.hand_landmarks[0]):
                height, width, channel = img.shape
                cx, cy = int(hand_lms.x*width), int(hand_lms.y*height)
                lms_list_in_pixel.append([id, cx, cy])
                lms_list.append([id, hand_lms.x, hand_lms.y])
        return lms_list, lms_list_in_pixel


# For testing
def main():
    # camera width and height
    width_cam, height_cam = 640, 480

    # Configure camera settings
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(3, width_cam) # index refer to VideoCaptureProperties
    cap.set(4, height_cam)
    detector = handDetector()

    while True:

        success, img = cap.read()
        lms_list, lms_list_in_pixel = detector.findHands(img)
        cv2.imshow('img', img)

        if cv2.waitKey(1) == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break

if __name__ == "__main__":
    main()