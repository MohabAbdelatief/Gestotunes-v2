const ObjectDetectionButton = document.getElementById('ObjectDetectionButton');
var socket = new WebSocket('ws://localhost:1234');
ObjectDetectionButton.addEventListener('click', () => {
    socket.send("Object Detection Activated");
}
);

// Path: Frontend/Features/VideoStream.JS