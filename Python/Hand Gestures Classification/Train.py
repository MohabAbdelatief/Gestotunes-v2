import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np


DataDictionary = pickle.load(open('./Data.pickle', 'rb'))

Data = np.asarray(DataDictionary['Data'])
Classes = np.asarray(DataDictionary['Classes'])

XTrain, XTest, YTrain, YTest = train_test_split(Data, Classes, test_size=0.2, shuffle=True, stratify=Classes)

Model = RandomForestClassifier()

Model.fit(XTrain, YTrain)

YPrediction = Model.predict(XTest)

Accuracy = accuracy_score(YPrediction, YTest)

print('{}% Accuracy:'.format(Accuracy * 100))

File = open('Model.p', 'wb')
pickle.dump({'Model': Model}, File)
File.close()
