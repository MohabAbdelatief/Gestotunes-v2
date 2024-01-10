var AudioPlayer = new Audio();

// ELEMENTS
const PlayPauseImage = document.getElementById("play-btn-img");
// const LogoutButton = document.getElementById("logout-btn");
// AUDIO CONTROLLER
const Previous = document.getElementById("previous-song-Button");
const Play = document.getElementById("play-pause-Button");
const Next = document.getElementById("next-song-Button");
const Volume = document.getElementById("volume");
const VolumeImage = document.getElementById("volume-img");
// // FAVORITE SYSTEM
// const Favorite = document.getElementById("favorite");
// const FavoriteUnfavoriteImage = document.getElementById("favorite-btn-img");
// EVENT LISTENERS
Previous.addEventListener("click", PreviousSong);
Play.addEventListener("click", PlaySong);
Next.addEventListener("click", NextSong);
Volume.addEventListener("input", VolumeChange);
// LogoutButton.addEventListener("click", LogoutAction);
// Favorite.addEventListener("click", FavoriteSong);

// GLOBAL VARIABLES
let CurrentSongID = 1;
let AlbumID;
let ArtistID;
let ArtistName;
let AlbumPhoto;
let SongName;
let SongPath;
let SongID;

// FLAGS
let IsPlaying = false;
// let IsFavorite = false;

// FETCH FUNCTIONS
function GetInfo() {
    return fetch(`http://localhost:3000/getSongs/id?id=${CurrentSongID}`)
        .then(response => response.json())
        .then(SongData => {
            // SONG ROW
            console.log(SongData);
            // SONG INFO
            SongName = SongData[0].song_name;
            SongPath = SongData[0].song_path;
            SongID = SongData[0].song_id;
            // ALBUM ID
            AlbumID = SongData[0].album_id;
            return fetch(`http://localhost:3000/getAlbums/id?id=${AlbumID}`)
                .then(response => response.json())
                .then(AlbumData => {
                    // ALBUM ROW
                    console.log(AlbumData);
                    // ARTIST ID
                    ArtistID = AlbumData[0].artist_id;
                    // ALBUM PHOTO
                    AlbumPhoto = AlbumData[0].album_image;
                    return fetch(`http://localhost:3000/getArtists/id?id=${ArtistID}`)
                        .then(response => response.json())
                        .then(ArtistData => {
                            // ARTIST ROW
                            console.log(ArtistData);
                            // ARTIST INFO
                            ArtistName = ArtistData[0].artist_name;

                            console.log("Album ID:", AlbumID);
                            console.log("Album Photo:", AlbumPhoto);
                            console.log("Artist Name:", ArtistName);
                            console.log("Song Name:", SongName);
                            console.log("Song Path:", SongPath);

                            return [AlbumPhoto, ArtistName, SongName, SongPath, SongID];
                        });
                });
        });
}
// GUI FUNCTIONS
function UpdateGUI() {
    GetInfo().then(Info => {
        // ALBUM PHOTO
        document.getElementById("song-image-mp").src = Info[0];
        // ARTIST NAME
        document.getElementById("artist-name-mp").textContent = Info[1];
        // SONG NAME
        document.getElementById("song-name-mp").textContent = Info[2];
    });

}

// AUDIO CONTROLLER FUNCTIONS

// PLAY/PAUSE SONG
function PlaySong() {
    if (IsPlaying == false) {
        GetInfo().then(Info => {
            AudioPlayer.src = Info[3];
            AudioPlayer.play();
            PlayPauseImage.src = "../../Backend/Database/Icons/pause.png";
            IsPlaying = true;
        });
        UpdateGUI();
    }
    else {
        AudioPlayer.pause();
        PlayPauseImage.src = "../../Backend/Database/Icons/play.png";
        IsPlaying = false;
    }
}

// NEXT SONG
function NextSong() {
    // CHECK IF CURRENT SONG IS THE LAST SONG
    if (CurrentSongID == 18) {
        CurrentSongID = 1;
    }
    else {
        CurrentSongID++;
    }
    GetInfo().then(Info => {
        AudioPlayer.src = Info[3];
        AudioPlayer.play();
        PlayPauseImage.src = "../../Backend/Database/Icons/pause.png";
        IsPlaying = true;
    });
    UpdateGUI();
}

// PREVIOUS SONG
function PreviousSong() {
    // CHECK IF CURRENT SONG IS THE FIRST SONG
    if (CurrentSongID == 1) {
        CurrentSongID = 18;
    }
    else {
        CurrentSongID--;
    }
    GetInfo().then(Info => {
        AudioPlayer.src = Info[3];
        AudioPlayer.play();
        PlayPauseImage.src = "../../Backend/Database/Icons/pause.png";
        IsPlaying = true;
    });
    UpdateGUI();
}

// VOLUME CONTROLLER
function VolumeChange() {
    AudioPlayer.volume = Volume.value / 100;
    if (Volume.value > 35)
        VolumeImage.src = "../../Backend/Database/Icons/high-volume.png";
    else if (Volume.value < 35 && Volume.value > 5)
        VolumeImage.src = "../../Backend/Database/Icons/Low-volume1.png"
    else if (Volume.value < 1)
        VolumeImage.src = "../../Backend/Database/Icons/volume-mute.png"
}
// Functions
let PlaylistID = 1;
async function FavoriteSong() {
    if (IsFavorite == false) {
        GetInfo().then(Info => {
            const Song_ID = Info[4];
            fetch('http://localhost:3000/addSongToPlaylist?playlist_id=' + PlaylistID + '&song_id=' + Song_ID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ PlaylistID, Song_ID }),
            }).then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('Song added successfully');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while processing your request');
                });
        });
        FavoriteUnfavoriteImage.src = "../../Backend/Database/Icons/favorite.png";
        IsFavorite = true;
    }
    else {
        GetInfo().then(Info => {
            const Song_ID = Info[4];
            fetch('http://localhost:3000/deleteSongFromPlaylist?playlist_id=' + PlaylistID + '&song_id=' + Song_ID, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ PlaylistID, Song_ID }),
            }).then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('Song deleted successfully');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while processing your request');
                });
        });
        FavoriteUnfavoriteImage.src = "../../Backend/Database/Icons/unfavorite.png";
        IsFavorite = false;
    }
}

// Logout
function LogoutAction() {
    window.location.href = "../Login/login.html";
}
// -----------------------------
// WebSocket
// -----------------------------
const serverUrl = 'ws://localhost:1234'; // WebSocket server address

var websocket = new WebSocket(serverUrl);

websocket.onmessage = function (event) {
    var message = event.data;
    console.log('Message received: ' + message); // HAND GESTURES
    if (message === 'Play') {
        if (AudioPlayer.paused) {
            AudioPlayer.play();
            PlayPauseImage.src = '../../Backend/Database/icons/pause.png';
        } else {
            AudioPlayer.pause();
            PlayPauseImage.src = '../../Backend/Database/icons/play.png';
        }
    } else if (message === 'Pause') {
        if (!AudioPlayer.paused) {
            AudioPlayer.pause();
            PlayPauseImage.src = '../../Backend/Database/icons/play.png';
        }

    } else if (message === 'Next') {
        NextSong();
    } else if (message === 'Previous') {
        PreviousSong();
    } else if (message === 'VolumeUp') {
        if (AudioPlayer.volume < 1) {
            AudioPlayer.volume = 1;
            Volume.value = AudioPlayer.volume * 100;
        }
    } else if (message === 'VolumeDown') {
        if (AudioPlayer.volume > 0) {
            AudioPlayer.volume = 0.1;
            Volume.value = AudioPlayer.volume * 100;
        }
    } else if (message === 'Mute') {
        AudioPlayer.volume = 0;
        Volume.value = AudioPlayer.volume * 100;
    }
};