import cv2 as cv
import mediapipe as mp
import numpy as np
import pyautogui

HandsDetection = mp.solutions.hands
HandsDetector = HandsDetection.Hands(
    max_num_hands=1, min_detection_confidence=0.5, static_image_mode=True
)
CoordinatesHistoryLength = 10
IndexFingerCoordinates = []
Capturer = cv.VideoCapture(0)
while Capturer.isOpened():
    Available, Frame = Capturer.read()
    Frame = cv.flip(Frame, 1)
    Results = HandsDetector.process(cv.cvtColor(Frame, cv.COLOR_BGR2RGB))
    if Results.multi_hand_landmarks:
        for HandLandmarks in Results.multi_hand_landmarks:
            IndexFinger = HandLandmarks.landmark[
                HandsDetection.HandLandmark.INDEX_FINGER_TIP
            ]
            ThumbFinger = HandLandmarks.landmark[HandsDetection.HandLandmark.THUMB_TIP]
            IndexFingerX, IndexFingerY = float(
                IndexFinger.x * pyautogui.size()[0]
            ), float(IndexFinger.y * pyautogui.size()[1])
            ThumbX, ThumbY = float(ThumbFinger.x * pyautogui.size()[0]), float(
                ThumbFinger.y * pyautogui.size()[1]
            )
            IndexFingerCoordinates.append((IndexFingerX, IndexFingerY))
            IndexFingerCoordinates = IndexFingerCoordinates[-CoordinatesHistoryLength:]
            # Weighted Average Smoothing
            if len(IndexFingerCoordinates) > 1:
                Weights = np.exp(np.linspace(-1, 0, len(IndexFingerCoordinates)))
                Weights /= Weights.sum()
                TargetX = np.average(
                    [Coordinates[0] for Coordinates in IndexFingerCoordinates],
                    weights=Weights,
                )
                TargetY = np.average(
                    [Coordinates[1] for Coordinates in IndexFingerCoordinates],
                    weights=Weights,
                )
                pyautogui.moveTo(TargetX, TargetY)
                EuclideanDistance = np.sqrt(
                    (IndexFingerX - ThumbX) ** 2 + (IndexFingerY - ThumbY) ** 2
                )
                if EuclideanDistance < 50:
                    pyautogui.click()
Capturer.release()
cv.destroyAllWindows()
