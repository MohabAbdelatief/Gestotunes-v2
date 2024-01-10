
var websocket = new WebSocket(serverUrl);

websocket.onmessage = function (event) {
    var message = event.data;
    console.log('Message received: ' + message);
    if (message.trim() === 'banna') {
        setTimeout(function () {
            window.location.href = '../Playlist/happy.html';
        }, 3000);
    }
    else if (message.trim() === 'cup') {
        setTimeout(function () {
            window.location.href = '../Playlist/morning.html';
        }, 3000);
    }
};
