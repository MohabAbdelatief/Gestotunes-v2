const TUIOButton = document.getElementById('TUIOButton');
var socket = new WebSocket('ws://localhost:1234');
TUIOButton.addEventListener('click', () => {
    socket.send("TUIO Detection Activated");
});