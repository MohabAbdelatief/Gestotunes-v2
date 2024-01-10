import cv2 as cv
import numpy as np
from Helpers import Relative, RelativeT

GazeCoordinate = (0, 0)


def GetGazeCoordinate():
    global GazeCoordinate
    return GazeCoordinate


def DrawGaze(Frame, Points):
   
    ImagePoints1 = np.array([
        Relative(Points.landmark[4], Frame.shape),  # Nose tip
        Relative(Points.landmark[152], Frame.shape),  # Chin
        Relative(Points.landmark[263], Frame.shape),  # Left eye left corner
        Relative(Points.landmark[33], Frame.shape),  # Right eye right corner
        Relative(Points.landmark[287], Frame.shape),  # Left Mouth corner
        Relative(Points.landmark[57], Frame.shape)  # Right mouth corner
    ], dtype="double")

 
    ImagePoints2 = np.array([
        RelativeT(Points.landmark[4], Frame.shape),  # Nose tip
        RelativeT(Points.landmark[152], Frame.shape),  # Chin
        RelativeT(Points.landmark[263], Frame.shape),  # Left eye left corner
        RelativeT(Points.landmark[33], Frame.shape),  # Right eye right corner
        RelativeT(Points.landmark[287], Frame.shape),  # Left Mouth corner
        RelativeT(Points.landmark[57], Frame.shape)  # Right mouth corner
    ], dtype="double")
    
    ModelPoints = np.array([
        (0.0, 0.0, 0.0),  # Nose tip
        (0, -63.6, -12.5),  # Chin
        (-43.3, 32.7, -26),  # Left eye, left corner
        (43.3, 32.7, -26),  # Right eye, right corner
        (-28.9, -28.9, -24.1),  # Left Mouth corner
        (28.9, -28.9, -24.1)  # Right mouth corner
    ])

    ModeEyeBallCenterRight = np.array([[-29.05], [32.7], [-39.5]])
    
    ModeEyeBallCenterLeft = np.array([[29.05], [32.7], [-39.5]])

    FocalLength = Frame.shape[1]
    Center = (Frame.shape[1] / 2, Frame.shape[0] / 2)
    CameraMatrix = np.array(
        [[FocalLength, 0, Center[0]],
         [0, FocalLength, Center[1]],
         [0, 0, 1]], dtype="double"
    )

    DistanceCoefficients = np.zeros((4, 1))
    (Success, RotataionVector, TranslationVector) = cv.solvePnP(ModelPoints,
ImagePoints1, CameraMatrix, DistanceCoefficients, flags=cv.SOLVEPNP_ITERATIVE)    

    LeftPupil = Relative(Points.landmark[468], Frame.shape)
    RightPupil = Relative(Points.landmark[473], Frame.shape)

    
    _, Transformation, _ = cv.estimateAffine3D(
        ImagePoints2, ModelPoints)  

    if Transformation is not None:  
        LeftPupilWorldCoordinate = Transformation @ np.array(
            [[LeftPupil[0], LeftPupil[1], 0, 1]]).T
        RightPupilWorldCoordinate = Transformation @ np.array(
            [[RightPupil[0], RightPupil[1], 0, 1]]).T

        
        SLeft = ModeEyeBallCenterLeft + \
            (LeftPupilWorldCoordinate - ModeEyeBallCenterLeft) * 10
        SRight = ModeEyeBallCenterRight + \
            (RightPupilWorldCoordinate - ModeEyeBallCenterRight) * 10

        SAverage = (SLeft + SRight) / 2

        
        (EyePupil2D, _) = cv.projectPoints((int(SAverage[0]), int(SAverage[1]), int(
            SAverage[2])), RotataionVector, TranslationVector, CameraMatrix, DistanceCoefficients)

        
        (HeadPose, _) = cv.projectPoints((int((LeftPupilWorldCoordinate[0] + RightPupilWorldCoordinate[0]) / 2), int(
            (LeftPupilWorldCoordinate[1] + RightPupilWorldCoordinate[1]) / 2), int(40)), RotataionVector, TranslationVector, CameraMatrix, DistanceCoefficients)

        
        GazeAverage = (LeftPupil + (EyePupil2D[0][0] - LeftPupil) - (HeadPose[0][0] - LeftPupil) + RightPupil + (
            EyePupil2D[0][0] - RightPupil) - (HeadPose[0][0] - RightPupil)) / 2

        
        Point1 = (int((LeftPupil[0] + RightPupil[0]) / 2),
                  int((LeftPupil[1] + RightPupil[1]) / 2))
        Point2 = (int(GazeAverage[0]), int(GazeAverage[1]))
        cv.line(Frame, Point1, Point2, (0, 0, 255), 2)

        
        global GazeCoordinate
        GazeCoordinate = (GazeAverage[0], GazeAverage[1])
        
