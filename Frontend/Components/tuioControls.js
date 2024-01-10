// -----------------------------
// WebSocket
// -----------------------------
var websocket = new WebSocket(serverUrl);

websocket.onmessage = function (event) {
    var message = event.data;
    console.log('Message received: ' + message); // HAND GESTURES
    if (message == "36") {
        // -----------
        // PLAY/PAUSE
        // -----------
        if (AudioPlayer.paused) {
            AudioPlayer.play();
            PlayPauseImage.src = '../../Backend/Database/icons/pause.png';
        } else {
            AudioPlayer.pause();
            PlayPauseImage.src = '../../Backend/Database/icons/play.png';
        }
    } else if (message == "37") {
        // ------
        // PAUSE
        // ------
        if (!AudioPlayer.paused) {
            AudioPlayer.pause();
            PlayPauseImage.src = '../../Backend/Database/icons/play.png';
        }

    } else if (message === "38") {
        // -----
        // NEXT
        // -----
        NextSong();
    } else if (message === "39") {
        // ------
        // PREVIOUS
        // ------
        PreviousSong();
    }
    // ----------------
    // VOLUME CONTROL
    // ----------------
    else if (message === "1") {
        AudioPlayer.volume = 0.03;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "2") {
        AudioPlayer.volume = 0.06;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "3") {
        AudioPlayer.volume = 0.09;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "4") {
        AudioPlayer.volume = 0.12;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "5") {
        AudioPlayer.volume = 0.15;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "6") {
        AudioPlayer.volume = 0.18;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "7") {
        AudioPlayer.volume = 0.21;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "8") {
        AudioPlayer.volume = 0.24;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "9") {
        AudioPlayer.volume = 0.27;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "10") {
        AudioPlayer.volume = 0.30;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "11") {
        AudioPlayer.volume = 0.33;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "12") {
        AudioPlayer.volume = 0.36;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "13") {
        AudioPlayer.volume = 0.39;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "14") {
        AudioPlayer.volume = 0.42;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "15") {
        AudioPlayer.volume = 0.45;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "16") {
        AudioPlayer.volume = 0.48;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "17") {
        AudioPlayer.volume = 0.51;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "18") {
        AudioPlayer.volume = 0.54;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "19") {
        AudioPlayer.volume = 0.57;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "20") {
        AudioPlayer.volume = 0.60;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "21") {
        AudioPlayer.volume = 0.63;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "22") {
        AudioPlayer.volume = 0.66;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "23") {
        AudioPlayer.volume = 0.69;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "24") {
        AudioPlayer.volume = 0.72;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "25") {
        AudioPlayer.volume = 0.75;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "26") {
        AudioPlayer.volume = 0.78;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "27") {
        AudioPlayer.volume = 0.81;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "28") {
        AudioPlayer.volume = 0.84;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "29") {
        AudioPlayer.volume = 0.87;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "30") {
        AudioPlayer.volume = 0.90;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "31") {
        AudioPlayer.volume = 0.93;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "32") {
        AudioPlayer.volume = 0.96;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "33") {
        AudioPlayer.volume = 0.99;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "34") {
        AudioPlayer.volume = 0.99;
        Volume.value = AudioPlayer.volume * 100;
    }
    else if (message === "35") {
        AudioPlayer.volume = 1;
        Volume.value = AudioPlayer.volume * 100;
    }
    // VOLUME CONTROL
};