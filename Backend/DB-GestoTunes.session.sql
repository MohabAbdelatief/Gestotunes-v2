-- CREATE ALL TABLES
-- @block
CREATE TABLE Artist (
  artist_id INT PRIMARY KEY AUTO_INCREMENT,
  artist_name VARCHAR(255) NOT NULL,
  artist_image VARCHAR(255) NOT NULL
);
-- @block 
CREATE TABLE Album (
  album_id INT PRIMARY KEY AUTO_INCREMENT,
  album_name VARCHAR(255) NOT NULL,
  album_image VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES Artist(artist_id)
);
-- @block
CREATE TABLE Song (
  song_id INT PRIMARY KEY AUTO_INCREMENT,
  song_name VARCHAR(255) NOT NULL,
  song_path VARCHAR(255) NOT NULL,
  album_id INT NOT NULL,
  FOREIGN KEY (album_id) REFERENCES Album(album_id)
);
-- @block
CREATE TABLE Users(
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
-- @block
DROP TABLE PlaylistSongs;
DROP TABLE Playlist;
-- @block
CREATE TABLE Playlist(
  playlist_id INT AUTO_INCREMENT PRIMARY KEY,
  playlist_name VARCHAR(255) NOT NULL UNIQUE
);
-- @block
CREATE TABLE PlaylistSongs (
  PlaylistID INT,
  SongID INT,
  FOREIGN KEY (PlaylistID) REFERENCES Playlist(playlist_id),
  FOREIGN KEY (SongID) REFERENCES Song(song_id),
  PRIMARY KEY (PlaylistID, SongID)
);
-- @block
INSERT INTO Playlist (playlist_name)
VALUES ('Happy Playlist');
-- @block
INSERT INTO PlaylistSongs (PlaylistID, SongID)
VALUES (3, 18),
  (3, 13),
  (3, 15),
  (3, 17);