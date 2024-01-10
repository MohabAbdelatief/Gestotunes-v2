import os
import cv2 as cv

DatasetPath = './Dataset'

if not os.path.exists(DatasetPath):
    os.makedirs(DatasetPath)

NumberOfClasses = 10
NumberOfImages = 200

Camera = cv.VideoCapture(0)

for i in range(NumberOfClasses):
    if not os.path.exists(os.path.join(DatasetPath, str(i))):
        os.makedirs(os.path.join(DatasetPath, str(i)))
    print('Collecting data for class {}'.format(i))

    Done = False
    while True:
        Available, Image = Camera.read()
        cv.putText(Image, 'Ready? Press "Q"! :)', (100, 50), cv.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3,cv.LINE_AA)
        Image = cv.flip(Image,1)
        cv.imshow('Window', Image)
        if cv.waitKey(25) == ord('q'):
            break

    Counter = 0
    while Counter < NumberOfImages:
        Available, Image = Camera.read()
        Image = cv.flip(Image,1)
        cv.imshow('Window', Image)
        cv.waitKey(25)
        cv.imwrite(os.path.join(DatasetPath, str(i), '{}.jpg'.format(Counter)), Image)
        Counter += 1

Camera.release()
cv.destroyAllWindows()
