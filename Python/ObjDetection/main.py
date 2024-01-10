import cv2
import numpy as np
import websocket
import json
import threading

try:
    import thread
except ImportError:
    import _thread as thread
import time

# Load YOLO
net = cv2.dnn.readNet(
    "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/ObjDetection/yolov3.weights",
    "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/ObjDetection/yolov3.cfg",
)
classes = []
with open(
    "C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/ObjDetection/coco.names", "r"
) as f:
    classes = [line.strip() for line in f]

layer_names = net.getUnconnectedOutLayersNames()

# Open a webcam
cap = cv2.VideoCapture(0)

# WebSocket URL
websocket_url = "ws://localhost:1234"


# Function to send recognized name to the Node.js server
def send_object_name(ws, name):
    data = name
    try:
        ws.send(data)
        print(f"Recognition result sent successfully!")
    except Exception as e:
        print(f"Error sending recognition result: {e}")


# Create a WebSocket client
def on_message(ws, message):
    print(message)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")


def on_open(ws):
    def run(*args):
        while True:
            time.sleep(1)
        ws.close()
        print("Thread terminating...")

    thread.start_new_thread(run, ())


# Establish a WebSocket connection
ws = websocket.WebSocketApp(
    websocket_url,
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close,
)

wst = threading.Thread(target=ws.run_forever)
wst.daemon = True
wst.start()


detected_objects = {}
while cap.isOpened():
    ret, frame = cap.read()
    height, width, channels = frame.shape

    # Convert the image to blob format
    blob = cv2.dnn.blobFromImage(
        frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False
    )

    # Forward pass through the network
    net.setInput(blob)
    outs = net.forward(layer_names)

    # Post-process the output
    # ... [rest of your object detection code]
    # Post-process the output
    boxes = []
    confidences = []
    class_ids = []
    detected_labels = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5:
                # Object detected
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                # Rectangle coordinates
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)
                label = str(classes[class_id])
                detected_labels.append(label)

    # Send detected labels to the WebSocket server
    # if detected_labels:
    #     data = {"detected_labels": detected_labels}
    #     ws.send(json.dumps(data))

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

    current_detected = set()
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(classes[class_ids[i]])
            confidence = confidences[i]
            color = (0, 255, 0)  # Green
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(
                frame,
                f"{label} {confidence:.2f}",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                2,
            )
            current_detected.add(label)
            # Check if the label has been detected and a message has been sent
            if label in detected_objects and detected_objects[label]:
                continue  # Skip sending message if already sent

            if confidence > 0.80:
                if label in ["banana", "cup", "frisbee"]:
                    print(f"{label} detected!")
                    send_object_name(ws, label)
                    detected_objects[label] = True

    for label in detected_objects.keys():
        if label not in current_detected:
            detected_objects[label] = False

    # Display the result
    # cv2.imshow("Object Detection", frame)

    # # Break the loop when 'q' key is pressed
    # if cv2.waitKey(1) & 0xFF == ord("q"):
    #     break

# Release the webcam and close the window
cap.release()
cv2.destroyAllWindows()
