import mediapipe as mp
import cv2 as cv
from Helpers import Relative, RelativeT
import Gaze
import time

FaceMeshDetection = mp.solutions.face_mesh
FaceMeshDetector = FaceMeshDetection.FaceMesh(max_num_faces=1,refine_landmarks=True,min_detection_confidence=0.5,min_tracking_confidence=0.5)

Path = 'Gaze Coordinates.csv'
CSV = open(Path, 'w', newline='')
CSV.write('X,Y\n')

CaptureDurationInSeconds = 60
StartTime = time.time()

Capturer = cv.VideoCapture(0)

while (time.time() - StartTime)<CaptureDurationInSeconds:
    Available, Frame = Capturer.read()
    Frame = cv.flip(Frame, 1)
    Results = FaceMeshDetector.process(cv.cvtColor(Frame, cv.COLOR_BGR2RGB))

    if Results.multi_face_landmarks:
        FaceLandmarks = Results.multi_face_landmarks[0]
        Gaze.DrawGaze(Frame, FaceLandmarks)
        GazeCoordinate = Gaze.GetGazeCoordinate()
        if GazeCoordinate:
            GazeX = int(GazeCoordinate[0])
            GazeY = int(GazeCoordinate[1])
            print("Gaze Coordinates:", [GazeX, GazeY])
            CSV.write(f'{GazeX},{GazeY}\n')
CSV.close()
Capturer.release()
cv.destroyAllWindows()