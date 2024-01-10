const FaceExpressionButton = document.getElementById('FaceExpressionButton');
var socket = new WebSocket('ws://localhost:1234');
FaceExpressionButton.addEventListener('click', () => {
    socket.send("Face Expression Detection Activated");
}
);  