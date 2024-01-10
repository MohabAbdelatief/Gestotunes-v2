// Filename: sideBar.js
// VARIABLES
const AddPlaylistButton = document.getElementById('add-playlist');
// EVENT LISTENER
getPlaylistFromDatabase();
AddPlaylistButton.addEventListener('click', AddNewPlaylistGUI);
// FUNCTIONS
function AddNewPlaylistGUI() {
    var playlistName = prompt("New Playlist Name");
    if (playlistName) {
        addPlaylistToDatabase(playlistName);
        var newPlaylistItem = document.createElement('div');
        newPlaylistItem.className = 'playlist-item';

        var playlistImageDiv = document.createElement('div');
        playlistImageDiv.className = 'playlist-image';
        var playlistImage = document.createElement('img');
        playlistImage.id = 'playlist-photo';
        playlistImage.src = '../../Backend/Database/Images/playlist-img.png';
        playlistImage.alt = 'playlist photo';
        playlistImageDiv.appendChild(playlistImage);

        var playlistDetailsDiv = document.createElement('div');
        playlistDetailsDiv.className = 'playlist-details';
        var playlistTitle = document.createElement('h3');
        playlistTitle.textContent = playlistName;
        playlistDetailsDiv.appendChild(playlistTitle);

        var deleteDiv = document.createElement('div');
        deleteDiv.className = 'delete';
        var deleteImage = document.createElement('img');
        deleteImage.id = 'delete-btn';
        deleteImage.src = '../../Backend/Database/icons/delete.png';
        deleteImage.alt = 'Delete';
        deleteDiv.appendChild(deleteImage);

        deleteImage.addEventListener('click', (event) => {
            DeletePlaylistGUI.call(event.target);
            deletePlaylistFromDatabase(playlistName);
        });

        newPlaylistItem.appendChild(playlistImageDiv);
        newPlaylistItem.appendChild(playlistDetailsDiv);
        newPlaylistItem.appendChild(deleteDiv);

        document.querySelector('.sideBar').appendChild(newPlaylistItem);
    }
}
// PLAYLIST CRUD
function addPlaylistToDatabase(PlaylistName) {
    fetch('http://localhost:3000/addPlaylist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playlist_name: PlaylistName
        })
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });
}
function getPlaylistFromDatabase() {
    fetch('http://localhost:3000/getPlaylist')
        .then(response => response.json())
        .then(function (playlists) {
            console.log(playlists);
            playlists.forEach(playlist => {
                var playlistName = playlist.playlist_name;
                var newPlaylistItem = document.createElement('div');
                newPlaylistItem.className = 'playlist-item';

                var playlistImageDiv = document.createElement('div');
                playlistImageDiv.className = 'playlist-image';
                var playlistImage = document.createElement('img');
                playlistImage.id = 'playlist-photo';
                playlistImage.src = '../../Backend/Database/Images/playlist-img.png';
                playlistImage.alt = 'playlist photo';
                playlistImageDiv.appendChild(playlistImage);

                var playlistDetailsDiv = document.createElement('div');
                playlistDetailsDiv.className = 'playlist-details';
                var playlistTitle = document.createElement('h3');
                playlistTitle.textContent = playlist.playlist_name;
                playlistDetailsDiv.appendChild(playlistTitle);

                var deleteDiv = document.createElement('div');
                deleteDiv.className = 'delete';
                var deleteImage = document.createElement('img');
                deleteImage.id = 'delete-btn';
                deleteImage.src = '../../Backend/Database/icons/delete.png';
                deleteImage.alt = 'Delete';
                deleteDiv.appendChild(deleteImage);

                newPlaylistItem.dataset.playlistName = playlist.playlist_name;

                deleteImage.addEventListener('click', (event) => {
                    const item = event.target.closest('.playlist-item');
                    const name = item.dataset.playlistName;
                    DeletePlaylistGUI.call(item);
                    deletePlaylistFromDatabase(name);
                });
                deleteImage.addEventListener('click', (event) => {
                    DeletePlaylistGUI.call(event.target);
                    deletePlaylistFromDatabase(playlistName);
                });

                newPlaylistItem.appendChild(playlistImageDiv);
                newPlaylistItem.appendChild(playlistDetailsDiv);
                newPlaylistItem.appendChild(deleteDiv);

                document.querySelector('.sideBar').appendChild(newPlaylistItem);
            });

        });

}
function deletePlaylistFromDatabase(PlaylistName) {
    fetch('http://localhost:3000/deletePlaylist', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playlist_name: PlaylistName
        })
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });
}
function DeletePlaylistGUI() {
    this.closest('.playlist-item').remove();
}







