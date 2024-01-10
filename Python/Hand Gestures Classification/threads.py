import pickle
import cv2 as cv
import mediapipe as mp
import numpy as np
import asyncio
import websockets
import threading
import queue

ModelDictionary = pickle.load(
    open(
        "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Hand Gestures Classification/Model.p",
        "rb",
    )
)
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

gesture_queue = queue.Queue()

last_sent_gesture = None


def gesture_recognition_thread():
    global gesture_queue
    Camera = cv.VideoCapture(0)

    while Camera.isOpened():
        Available, Image = Camera.read()
        Image = cv.flip(Image, 1)

        Height, Width, ColorChannel = Image.shape
        Results = HandsDetector.process(cv.cvtColor(Image, cv.COLOR_BGR2RGB))
        PredictedGesture = None

        if Results.multi_hand_landmarks:
            for HandLandmarks in Results.multi_hand_landmarks:
                DrawingUtils.draw_landmarks(
                    Image,
                    HandLandmarks,
                    HandsDetection.HAND_CONNECTIONS,
                    DrawingStyles.get_default_hand_landmarks_style(),
                    DrawingStyles.get_default_hand_connections_style(),
                )

                ImageHandLandmarks = []
                TemporaryX = []
                TemporaryY = []
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

        if PredictedGesture and PredictedGesture != last_sent_gesture:
            gesture_queue.put(PredictedGesture)

        # cv.imshow("Window", Image)
        # if cv.waitKey(1) & 0xFF == ord("q"):
        #     break
    
    Camera.release()


async def send_gesture_to_server():
    global gesture_queue, last_sent_gesture
    async with websockets.connect("ws://localhost:1234") as websocket:
        while True:
            if not gesture_queue.empty():
                PredictedGesture = gesture_queue.get()
                if PredictedGesture != last_sent_gesture:
                    await websocket.send(PredictedGesture)
                    last_sent_gesture = PredictedGesture
            else:
                await asyncio.sleep(0.1)


def main():
    threading.Thread(target=gesture_recognition_thread, daemon=True).start()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(send_gesture_to_server())
    loop.run_forever()


if __name__ == "__main__":
    main()
