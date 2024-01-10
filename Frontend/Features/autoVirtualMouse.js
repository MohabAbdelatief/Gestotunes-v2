var websocket = new WebSocket('ws://localhost:1234');

websocket.addEventListener('open', function (event) {
    websocket.send("Virtual Mouse Activated");
});
