document.addEventListener('DOMContentLoaded', (event) => {
    var SongList = document.querySelector(".all-music-songs");

    fetch(`http://localhost:3000/getPlaylistSongs/id?id=2`)
        .then(response => response.json())
        .then(playlistSongs => {
            // Assuming playlistSongs is an array of song IDs
            playlistSongs.forEach(playlistSong => {
                const songId = playlistSong.SongID;
                // Now fetch the details for each song by ID
                fetch(`http://localhost:3000/getSongs/id?id=${songId}`)
                    .then(response => response.json())
                    .then(songDetails => {
                        console.log(songDetails[0].album_id);
                        var AlbumID = songDetails[0].album_id;
                        var songName = songDetails[0].song_name;
                        // Fetch album details
                        return fetch(`http://localhost:3000/getAlbums/id?id=${AlbumID}`)
                            .then(response => response.json())
                            .then(AlbumData => {
                                // Extract album and artist details
                                console.log(AlbumData);
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
                                        songNameH3.textContent = songName;
                                        console.log(songName);

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



                                        // Append left section, album name, and add to playlist to song container
                                        songContainer.appendChild(leftDiv);
                                        songContainer.appendChild(songAlbumP);


                                        // Append the song container to the song list
                                        SongList.appendChild(songContainer);
                                    });
                            });
                    });
            });

        });
});