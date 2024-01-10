import asyncio
import websockets
import cv2 as cv
from fer import FER


async def emotion_detector():
    EmotionDetector = FER(mtcnn=True)
    Capturer = cv.VideoCapture(0)

    uri = "ws://localhost:1234"  # WebSocket server URI
    async with websockets.connect(uri) as websocket:
        while Capturer.isOpened():
            Available, Frame = Capturer.read()
            if not Available:
                break

            Frame = cv.flip(Frame, 1)
            Results = EmotionDetector.detect_emotions(Frame)

            if Results:
                Emotions = Results[0]["emotions"]
                PredictedEmotion = max(Emotions, key=Emotions.get)
            else:
                PredictedEmotion = "No Expression"

            cv.putText(
                Frame,
                f"{PredictedEmotion}",
                (10, 30),
                cv.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )

            await websocket.send(PredictedEmotion.encode())
            # cv.imshow("Facial Expression Detector", Frame)

            # if cv.waitKey(1) & 0xFF == ord("q"):
            #     break

    Capturer.release()
    cv.destroyAllWindows()


# Run the asyncio event loop
asyncio.run(emotion_detector())
