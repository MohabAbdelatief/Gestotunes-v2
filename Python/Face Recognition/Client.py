import cv2 as cv
import numpy as np
import dlib
import asyncio
import websockets
import json

FaceRecognitionModel = dlib.face_recognition_model_v1(
    "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Face Recognition/dlib_face_recognition_resnet_model_v1.dat"
)
FaceDetector = dlib.get_frontal_face_detector()
FaceLandmarksDetector = dlib.shape_predictor(
    "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Face Recognition/shape_predictor_68_face_landmarks.dat"
)

KnownFaceImage = cv.imread(
    "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Face Recognition/Known Faces/Mohab.jpg"
)
KnownFaceDescriptor = FaceRecognitionModel.compute_face_descriptor(
    KnownFaceImage,
    FaceLandmarksDetector(KnownFaceImage, FaceDetector(KnownFaceImage)[0]),
)
KnownID = "Mohab "


def RecognizeFace(FaceDescriptor, KnownFaceDescriptor, KnownID, Threshold):
    Distance = np.linalg.norm(np.array(KnownFaceDescriptor) - np.array(FaceDescriptor))
    if Distance < Threshold:
        RecognizedID = KnownID
        Confidence = 1 - Distance
        return RecognizedID, Confidence
    else:
        return "Unknown", 0.0


async def main():
    uri = "ws://localhost:1234"  # Replace with your WebSocket server address and port
    async with websockets.connect(uri) as websocket:
        Capturer = cv.VideoCapture(0)
        FrameSkipper = 3
        FrameCounter = 0

        while Capturer.isOpened():
            Available, Frame = Capturer.read()
            Frame = cv.flip(Frame, 1)

            if FrameCounter % FrameSkipper == 0:
                FrameGrayscale = cv.cvtColor(Frame, cv.COLOR_BGR2GRAY)
                Faces = FaceDetector(FrameGrayscale)

                if len(Faces) == 1:
                    for Face in Faces:
                        FaceLandmarks = FaceLandmarksDetector(FrameGrayscale, Face)
                        FaceDescriptor = FaceRecognitionModel.compute_face_descriptor(
                            Frame, FaceLandmarks
                        )
                        try:
                            RecognizedID, Confidence = RecognizeFace(
                                FaceDescriptor,
                                KnownFaceDescriptor,
                                KnownID,
                                Threshold=0.6,
                            )
                        except ValueError:
                            RecognizedID, Confidence = "Unknown", 0.0
                        message = {"id": RecognizedID, "confidence": Confidence}
                        await websocket.send(RecognizedID)

                        X1, Y1, X2, Y2 = (
                            Face.left(),
                            Face.top(),
                            Face.right(),
                            Face.bottom(),
                        )
                        cv.rectangle(Frame, (X1, Y1), (X2, Y2), (0, 255, 0), 2)
                        cv.putText(
                            Frame,
                            f"{RecognizedID} ({Confidence:.2f})",
                            (X1, Y1 - 10),
                            cv.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            (0, 255, 0),
                            2,
                        )
            # cv.imshow("Face Recognition", Frame)
            # cv.waitKey(1)
            FrameCounter += 1
        Capturer.release()
        cv.destroyAllWindows()


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
