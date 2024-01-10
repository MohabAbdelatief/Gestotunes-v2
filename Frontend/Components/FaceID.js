const Done = document.getElementById('ID-IMG-GIF'); // IMG element
const serverUrl = 'ws://localhost:1234'; // WebSocket server address

var websocket = new WebSocket(serverUrl);

websocket.onmessage = function (event) {
    var message = event.data;
    console.log('Message received: ' + message);
    if (message.trim() === 'Mohab') {
        Done.src = '../../Backend/Database/icons/face-id-done.gif';
        setTimeout(function () {
            window.location.href = '../Home/home.html';
        }, 3000);
    }
    else if (message.trim() === 'Nada') {
        Done.src = '../../Backend/Database/icons/face-id-done.gif';
        setTimeout(function () {
            window.location.href = '../Home/home.html';
        }, 3000);
    }
    else if (message.trim() === 'Ahmed') {
        Done.src = '../../Backend/Database/icons/face-id-done.gif';
        setTimeout(function () {
            window.location.href = '../Home/home.html';
        }, 3000);
    }
}