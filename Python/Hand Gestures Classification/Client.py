import pickle
import cv2 as cv
import mediapipe as mp
import numpy as np
import asyncio
import websockets

ModelDictionary = pickle.load(open("./Python/Hand Gestures Classification/Model.p", "rb"))
Model = ModelDictionary["Model"]

HandsDetection = mp.solutions.hands
DrawingUtils = mp.solutions.drawing_utils
DrawingStyles = mp.solutions.drawing_styles
HandsDetector = mp.solutions.hands.Hands(
    max_num_hands=1, min_detection_confidence=0.5, static_image_mode=True
)

ClassesDictionary = {
    0: "Play",
    1: "Pause",
    2: "Next",
    3: "Previous",
    4: "Favorite",
    5: "Not Favorite",
    6: "Volume Up",
    7: "Volume Down",
    8: "Mute",
    9: "None",
}


async def send_gesture_to_server():
    async with websockets.connect("ws://localhost:1234") as websocket:
        while True:
            # Capture and send gestures
            ImageHandLandmarks = []
            TemporaryX = []
            TemporaryY = []

            Available, Image = Camera.read()
            Image = cv.flip(Image, 1)

            Height, Width, ColorChannel = Image.shape

            Results = HandsDetector.process(cv.cvtColor(Image, cv.COLOR_BGR2RGB))

            if Results.multi_hand_landmarks:
                for HandLandmarks in Results.multi_hand_landmarks:
                    DrawingUtils.draw_landmarks(
                        Image,
                        HandLandmarks,
                        HandsDetection.HAND_CONNECTIONS,
                        DrawingStyles.get_default_hand_landmarks_style(),
                        DrawingStyles.get_default_hand_connections_style(),
                    )

                    for HandLandmarks in Results.multi_hand_landmarks:
                        for i in range(len(HandLandmarks.landmark)):
                            TemporaryX.append(HandLandmarks.landmark[i].x)
                            TemporaryY.append(HandLandmarks.landmark[i].y)

                        for i in range(len(HandLandmarks.landmark)):
                            ImageHandLandmarks.append(
                                HandLandmarks.landmark[i].x - min(TemporaryX)
                            )
                            ImageHandLandmarks.append(
                                HandLandmarks.landmark[i].y - min(TemporaryY)
                            )

                    x1 = int(min(TemporaryX) * Width) - 10
                    y1 = int(min(TemporaryY) * Height) - 10
                    x2 = int(max(TemporaryX) * Width) - 10
                    y2 = int(max(TemporaryY) * Height) - 10

                    Prediction = Model.predict([np.asarray(ImageHandLandmarks)])
                    PredictedGesture = ClassesDictionary[int(Prediction[0])]

                    await websocket.send(PredictedGesture)

                    cv.rectangle(Image, (x1, y1), (x2, y2), (0, 0, 0), 4)
                    cv.putText(
                        Image,
                        PredictedGesture,
                        (x1, y1 - 10),
                        cv.FONT_HERSHEY_SIMPLEX,
                        1.3,
                        (0, 0, 0),
                        3,
                        cv.LINE_AA,
                    )

            cv.imshow("Window", Image)
            if cv.waitKey(1) & 0xFF == ord("q"):
                break


Camera = cv.VideoCapture(0)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(send_gesture_to_server())
    loop.run_forever()
