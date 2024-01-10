import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import cv2

CSVPath = 'Gaze Coordinates.csv'
ImagePath = 'gui1.png'

GazeCoordinates = pd.read_csv(CSVPath, skiprows=1, names=['X', 'Y'])

Image = cv2.imread(ImagePath)
Image = cv2.cvtColor(Image, cv2.COLOR_BGR2RGB)

GazeCoordinates['XNormalized'] = GazeCoordinates['X'] / GazeCoordinates['X'].abs().max() * Image.shape[1]
GazeCoordinates['YNormalized'] = GazeCoordinates['Y'] / GazeCoordinates['Y'].abs().max() * Image.shape[0]

fig, ax = plt.subplots(figsize=(10, 8))
ax.imshow(Image, extent=[0, Image.shape[1], 0, Image.shape[0]], origin='upper')
sns.kdeplot(x=GazeCoordinates['XNormalized'], y=GazeCoordinates['YNormalized'], fill=True, cmap='inferno', cbar=False, ax=ax, alpha=0.4)
ax.set_xticks([])
ax.set_yticks([])
ax.set_frame_on(False)
plt.savefig('Heatmap.png', bbox_inches='tight', pad_inches=0)
plt.show()