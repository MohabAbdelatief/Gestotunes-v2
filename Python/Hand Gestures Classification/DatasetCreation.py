import os
import pickle
import mediapipe as mp
import cv2 as cv

HandsDetector = mp.solutions.hands.Hands(max_num_hands=1, min_detection_confidence=0.5, static_image_mode=True)
DatasetPath = './Dataset'
DatasetHandLandmarks = []
Classes = []

for FolderPath in os.listdir(DatasetPath):
    for ImagePath in os.listdir(os.path.join(DatasetPath, FolderPath)):
        ImageHandLandmarks = []
        TemporaryX = []
        TemporaryY = []

        Image = cv.imread(os.path.join(DatasetPath, FolderPath, ImagePath))
        Image = cv.cvtColor(Image, cv.COLOR_BGR2RGB)
        
        Results = HandsDetector.process(Image)
        if Results.multi_hand_landmarks:
            for HandLandmarks in Results.multi_hand_landmarks:
                for i in range(len(HandLandmarks.landmark)):
                    TemporaryX.append(HandLandmarks.landmark[i].x)
                    TemporaryY.append(HandLandmarks.landmark[i].y)
                for i in range(len(HandLandmarks.landmark)):
                    ImageHandLandmarks.append(HandLandmarks.landmark[i].x - min(TemporaryX))
                    ImageHandLandmarks.append(HandLandmarks.landmark[i].y - min(TemporaryY))
            DatasetHandLandmarks.append(ImageHandLandmarks)
            Classes.append(FolderPath)
File = open('Data.pickle', 'wb')
pickle.dump({'Data': DatasetHandLandmarks, 'Classes': Classes}, File)
File.close()
