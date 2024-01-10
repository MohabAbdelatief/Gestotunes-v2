// -----------------------------
// WebSocket
// -----------------------------
const Done = document.getElementById('TUIO-IMG-GIF'); // IMG element
const serverUrl = 'ws://localhost:1234';
var websocket = new WebSocket(serverUrl);

websocket.onmessage = function (event) {
    var message = event.data;
    console.log('TUIO Username received: ' + message);
    if (message == "Mohab" || message == "Nada" || message == "Shahd") {

        Done.src = '../../Backend/Database/icons/face-id-done.gif';
        setTimeout(function () {
            window.location.href = '../Home/home.html';
        }, 3000);
    }
};