const GestureButton = document.getElementById('GestureButton');
var socket = new WebSocket('ws://localhost:1234');
GestureButton.addEventListener('click', () => {
    socket.send("Gesture Detection Activated");
}
);  