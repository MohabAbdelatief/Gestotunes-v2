// -------------------------------------------------
const express = require('express'); // USED TO CREATE SERVER
const mysql = require('mysql2/promise'); // USED TO CONNECT TO DATABASE
const app = express(); // SERVER 
app.use(express.json()); // USED TO PARSE JSON
const port = 3000; // PORT NUMBER

// FOR PYTHON CODE PROCESSING FROM SERVER
let CurrentProcess = null;
// -------------------------------------------------


// -------------------------------------------------
// USE REST API
// -------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// -------------------------------------------------
// DATABASE CONFIGURATION
// -------------------------------------------------
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '345348349Na12',
    database: 'music_data',
};

// -------------------------------------------------
// LOGIN PAGE
// -------------------------------------------------
app.get('/getUsers', async (req, res) => {
    const user_name = req.query.username;
    const password = req.query.password;
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT username, password FROM Users WHERE username = ? AND password = ?', [user_name, password]);
    if (rows.length > 0) {
        console.log("User found");
        const userData =
        {
            username: rows[0].username,
            password: rows[0].password
        };
        res.json(userData);
        console.log("Username: " + userData.username + " Password: " + userData.password);
    }
    else {
        console.log("User not found or incorrect password");
        res.status(404).json({ error: "User not found or incorrect password" });
    }
    connection.end();
});


// -------------------------------------------------
// SIGN UP PAGE
// -------------------------------------------------
app.post('/addUser', async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    console.log('Adding user:', username, password);
    const statement = 'INSERT INTO Users (username, password) VALUES (?, ?)';
    const connection = await mysql.createConnection(dbConfig);
    connection.execute(statement, [username, password]);
    res.json({ success: true });
    connection.end();
});

// -------------------------------------------------
// GET METHODS
// -------------------------------------------------

// -------------------------------------------------
// 1. GET ALL SONGS
// -------------------------------------------------
app.get('/getSongs', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM song');
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 2. GET ALL ALBUMS
// -------------------------------------------------
app.get('/getAlbums', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM album');
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 3. GET ALL ARTISTS
// -------------------------------------------------
app.get('/getArtists', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM artist');
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 4. GET ALL PLAYLISTS
// -------------------------------------------------
app.get('/getPlaylists', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM Playlist');
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 5. GET ALL PLAYLIST SONGS
// -------------------------------------------------
app.get('/getPlaylistSongs', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM PlaylistSongs');
    res.json(rows);
    connection.end();
});
// --------------------------------------------------------------------------------
// 6. GET ALL PLAYLIST SONGS BY PLAYLIST ID 
// --------------------------------------------------------------------------------
app.get('/getPlaylistSongsByPlaylistID/playlist_id', async (req, res) => {
    const playlist_id = req.query.playlist_id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT song_id FROM PlaylistSongs WHERE playlist_id = ?', [playlist_id]);
    res.json(rows);
    connection.end();
});

// -------------------------------------------------
// GET BY ID METHODS
// -------------------------------------------------


// -------------------------------------------------
// 1. GET SONG BY ID
// -------------------------------------------------
app.get('/getSongs/id', async (req, res) => {
    const id = req.query.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM song WHERE song_id = ?', [id]);
    if (rows.length > 0) {
        console.log("Song Name: ", rows[0].song_name);
    } else {
        console.log("No song found with the given ID");
    }
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 2. GET ALBUM BY ID
// -------------------------------------------------
app.get('/getAlbums/id', async (req, res) => {
    const id = req.query.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM album WHERE album_id = ?', [id]);
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 3. GET ARTIST BY ID
// -------------------------------------------------
app.get('/getArtists/id', async (req, res) => {
    const id = req.query.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM artist WHERE artist_id = ?', [id]);
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// 4. GET PLAYLIST BY ID
// -------------------------------------------------
app.get('/getPlaylists/id', async (req, res) => {
    const id = req.query.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT * FROM Playlist WHERE playlist_id = ?', [id]);
    res.json(rows);
    connection.end();
});
app.get('/getPlaylistSongs/id', async (req, res) => {
    // find all songs in a playlistsongs
    const id = req.query.id;
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute('SELECT SongID FROM PlaylistSongs WHERE PlaylistID = ?', [id]);
    res.json(rows);
    connection.end();

});
// -------------------------------------------------
// 5. GET SONG ID BY NAME
// -------------------------------------------------
app.get('/getSongIdByName', async (req, res) => {
    const songName = req.query.name;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT song_id FROM song WHERE song_name = ?', [songName]);
        if (rows.length > 0) {
            res.json({ success: true, song_id: rows[0].song_id });
        } else {
            res.status(404).json({ success: false, message: 'Song not found' });
        }
        connection.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// -------------------------------------------------
// POST METHODS
// -------------------------------------------------
app.post('/addSongToPlaylist', async (req, res) => {
    try {
        // SONG ID AND PLAYLIST ID
        const playlist_id = req.body.playlist_id;
        const song_id = req.body.song_id;
        console.log('Adding song to playlist: ', playlist_id + " Song ID: " + song_id);

        const statement = 'INSERT INTO PlaylistSongs (PlaylistID, SongID) VALUES (?, ?)';
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(statement, [playlist_id, song_id]);
        res.json({ success: true });
        connection.end();
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// -------------------------------------------------
// DELETE METHODS
// -------------------------------------------------
app.delete('/deleteSongFromPlaylist', async (req, res) => {
    try {
        // SONG ID AND PLAYLIST ID
        const playlist_id = req.query.playlist_id;
        const song_id = req.query.song_id;
        console.log('Deleting song from playlist: ', playlist_id + " Song ID: " + song_id);

        const statement = 'DELETE FROM PlaylistSongs WHERE playlist_id = ? AND song_id = ?';
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(statement, [playlist_id, song_id]);
        res.json({ success: true });
        connection.end();
    } catch (error) {
        console.error('Error deleting song from playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// -------------------------------------------------
// ADD PLAYLIST
// -------------------------------------------------
app.post('/addPlaylist', async (req, res) => {
    try {
        const playlist_name = req.body.playlist_name;
        // DEBUG
        console.log('Adding playlist: ', playlist_name);
        // STATEMENT
        const statement = 'INSERT INTO Playlist (playlist_name) VALUES (?)';
        const connection = await mysql.createConnection(dbConfig);
        // SEND STATEMENT
        await connection.execute(statement, [playlist_name]);
        res.json({ success: true });
        connection.end();
    } catch (error) {
        console.error('Error adding playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
// -------------------------------------------------
// GET PLAYLIST
// -------------------------------------------------
app.get('/getPlaylist', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT playlist_name FROM Playlist');
    res.json(rows);
    connection.end();
});
// -------------------------------------------------
// DELETE PLAYLIST
// -------------------------------------------------
app.delete('/deletePlaylist', async (req, res) => {
    try {
        const playlist_name = req.body.playlist_name;
        // DEBUG
        console.log('Deleting playlist: ', playlist_name);
        // STATEMENT
        const statement = 'DELETE FROM Playlist WHERE playlist_name = ?';
        const connection = await mysql.createConnection(dbConfig);
        // SEND STATEMENT
        await connection.execute(statement, [playlist_name]);
        res.json({ success: true });
        connection.end();
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
// -------------------------------------------------
// LISTEN TO PORT
// -------------------------------------------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// --------------------
// SOCKET CONFIGURATION
// --------------------

const WebSocket = require('ws');
const { get } = require('http');
const wss = new WebSocket.Server({ port: 1234 });

// --------
// CLIENTS
// --------
const connectedClients = [];

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    connectedClients.push(ws);
    // ------------
    // PYTHON CODE
    // ------------
    const { spawn } = require('child_process');
    ws.on('message', function incoming(message) {
        const decodedMessage = Buffer.from(message).toString('utf-8');
        console.log("Spawn Client Message: " + decodedMessage);
        // ------------------
        // Gesture Detection
        // ------------------
        if (decodedMessage === 'Gesture Detection Activated') {
            if (CurrentProcess !== null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
                CurrentProcess = null;
            }
            CurrentProcess = spawn('python', ['C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Hand Gestures Classification/threads.py']);
        }
        // ------------------
        // Object Detection
        // ------------------
        else if (decodedMessage === "Object Detection Activated") {
            if (CurrentProcess != null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
            }
            CurrentProcess = spawn('python', ['C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/ObjDetection/main.py']);
        }
        // ------------------
        // Face Expression Detection
        // ------------------
        else if (decodedMessage === "Face Expression Detection Activated") {
            if (CurrentProcess != null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
            }
            CurrentProcess = spawn('python', ['C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Facial Expression Detector/Client.py']);
        }
        // ------------------
        // TUIO Detection
        // ------------------
        else if (decodedMessage === "TUIO Detection Activated") {
            if (CurrentProcess != null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
            }
            CurrentProcess = spawn('C:/Users/hobaz/Desktop/GestoTunes1.0f/Features/TUIO_/TUI/reacTIVision-1.5.1-win64/reacTIVision.exe');
            CurrentProcess = spawn('C:/Users/hobaz/Desktop/GestoTunes1.0f/Features/TUIO_/TUIO/TUIO11_NET-master/bin/Debug/TuioDemo.exe');
        }
        // --------------
        // Virtual Mouse
        // --------------
        else if (decodedMessage === "Virtual Mouse Activated") {
            if (CurrentProcess != null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
            }
            CurrentProcess = spawn('python', ['C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Virtual Mouse/Client.py']);
        }
        // --------------
        // Face ID Detection
        // --------------
        else if (decodedMessage === "Face ID Detection Activated") {
            if (CurrentProcess != null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
            }
            CurrentProcess = spawn('python', ['C:/Users/hobaz/Desktop/GestoTunes1.0f/Python/Face Recognition/Client.py']);
        }
        // --------------
        // TUIO Login
        // -------------
        else if (decodedMessage === "TUIO Login Detection Activated") {
            if (CurrentProcess != null) {
                console.log(`Ending Process`);
                CurrentProcess.kill();
            }
            CurrentProcess = spawn('C:/Users/hobaz/Desktop/GestoTunes1.0f/Features/TUIO_/TUI/reacTIVision-1.5.1-win64/reacTIVision.exe');
            CurrentProcess = spawn('C:/Users/hobaz/Desktop/GestoTunes1.0f/Features/TUIO_/TUIO/TUIO11_NET-master/bin/Debug/TuioDemo.exe');
        }
        // Forward the message to all connected clients
        for (let i = 0; i < connectedClients.length; i++) {
            const client = connectedClients[i];
            client.send(decodedMessage);
        }
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
        connectedClients.splice(connectedClients.indexOf(ws), 1);
    });
});
