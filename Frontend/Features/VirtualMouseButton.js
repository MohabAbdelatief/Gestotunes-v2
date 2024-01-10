const VirtualMouseButton = document.getElementById('VirtualMouseButton');
var socket = new WebSocket('ws://localhost:1234');
VirtualMouseButton.addEventListener('click', () => {
    socket.send("Virtual Mouse Activated");
}
);  