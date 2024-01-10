Relative = lambda landmark, shape: (int(landmark.x * shape[1]), int(landmark.y * shape[0]))
RelativeT = lambda landmark, shape: (int(landmark.x * shape[1]), int(landmark.y * shape[0]), 0)