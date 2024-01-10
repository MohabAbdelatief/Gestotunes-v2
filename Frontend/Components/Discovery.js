document.addEventListener('DOMContentLoaded', (event) => {
    var SongList = document.querySelector(".all-music-songs");
    
    fetch(`http://localhost:3000/getSongs`)
        .then(response => response.json())
        .then(SongData => {
            // Assuming SongData is an array of song objects
            SongData.forEach(songDetails => {
                var AlbumID = songDetails.album_id;
                // Fetch album details
                return fetch(`http://localhost:3000/getAlbums/id?id=${AlbumID}`)
                    .then(response => response.json())
                    .then(AlbumData => {
                        // Extract album and artist details
                        var ArtistID = AlbumData[0].artist_id;
                        var AlbumPhoto = AlbumData[0].album_image;

                        // Fetch artist details
                        return fetch(`http://localhost:3000/getArtists/id?id=${ArtistID}`)
                            .then(response => response.json())
                            .then(ArtistData => {
                                var ArtistName = ArtistData[0].artist_name;

                                // Create the song container
                                var songContainer = document.createElement("div");
                                songContainer.className = "song-container";

                                // Create the left section
                                var leftDiv = document.createElement("div");
                                leftDiv.className = "left";

                                // Create the song photo
                                var songPhotoDiv = document.createElement("div");
                                songPhotoDiv.className = "song-photo";

                                var songPhotoImg = document.createElement("img");
                                songPhotoImg.src = AlbumPhoto;
                                songPhotoImg.alt = "Song Photo";

                                // Append image to song photo div
                                songPhotoDiv.appendChild(songPhotoImg);

                                // Create the song details
                                var songDetailsDiv = document.createElement("div");
                                songDetailsDiv.className = "song-details";

                                var songNameH3 = document.createElement("h3");
                                songNameH3.textContent = songDetails.song_name;

                                var songArtistP = document.createElement("p");
                                songArtistP.textContent = ArtistName;

                                // Append song name and artist to song details div
                                songDetailsDiv.appendChild(songNameH3);
                                songDetailsDiv.appendChild(songArtistP);

                                // Append song photo and song details to left div
                                leftDiv.appendChild(songPhotoDiv);
                                leftDiv.appendChild(songDetailsDiv);

                                // Create the album name paragraph
                                var songAlbumP = document.createElement("p");
                                songAlbumP.textContent = AlbumData[0].album_name;
                                songAlbumP.className = "song-album";

                                // Create the add to playlist section
                                var addToPlaylistDiv = document.createElement("div");
                                addToPlaylistDiv.className = "add-to-playlist";

                                var addToPlaylistImg = document.createElement("img");
                                addToPlaylistImg.src = "../../Backend/Database/icons/plus.png";
                                addToPlaylistImg.alt = "add-song-to-playlist";
                                addToPlaylistImg.className = "addSongToPlaylist";
                                addToPlaylistImg.addEventListener('click', () => {
                                    console.log('Song name to add:', songDetails.song_name);
                                    const songName = songDetails.song_name; // Retrieve the song name from the songDetails object

                                    // Fetch the song ID by song name from your backend
                                    fetch(`http://localhost:3000/getSongIdByName?name=${encodeURIComponent(songName)}`)
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                // If the song ID is retrieved successfully, add the song to the playlist
                                                const songId = data.song_id;
                                                const playlistId = 1; // Assuming you want to add to playlist with ID 1

                                                return fetch('http://localhost:3000/addSongToPlaylist', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({ song_id: songId, playlist_id: playlistId }),
                                                });
                                            } else {
                                                throw new Error('Failed to get song ID');
                                            }
                                        })
                                        .then(response => response.json())
                                        .then(addData => {
                                            if (addData.success) {
                                                console.log('Song added to playlist successfully');
                                            } else {
                                                throw new Error('Failed to add song to playlist');
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Error:', error);
                                        });
                                });

                                // Append image to add to playlist div
                                addToPlaylistDiv.appendChild(addToPlaylistImg);

                                // Append left section, album name, and add to playlist to song container
                                songContainer.appendChild(leftDiv);
                                songContainer.appendChild(songAlbumP);
                                songContainer.appendChild(addToPlaylistDiv);

                                // Append the song container to the song list
                                SongList.appendChild(songContainer);
                            });
                    });
            });
        });

});