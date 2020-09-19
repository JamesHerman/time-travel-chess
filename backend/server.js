const io = require('socket.io')(3030);
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'build')))

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

io.on('connection', async (socket) => {
    console.log('connect ' + socket.id)
    socket.on('create', () => {
        createRoom(socket);
    })
    socket.on('join', (data) => {
        joinRoom(socket, data.roomID)
    })
});

function createRoom(socket) {
    const roomID = getEmptyRoom();
    socket.join(roomID, () => {
        io.to(socket.id).emit('created', {
            roomID: roomID
        })
    })
    socket.on('move', function (data) {
        socket.to(roomID).emit('move', data)
    });
}

function getEmptyRoom() {
    let roomID = Math.floor(Math.random()*1000000);
    io.in(roomID).clients((error, clients) => {
        if (error) throw error;
        if (clients[0]) {
            roomID = getEmptyRoom();
        }
    })
    return roomID;
}

function joinRoom(socket, roomID) {
    let roomFull = false
    let roomExists = true
    io.in(roomID).clients((error, clients) => {
        if (!clients[0]) {
            roomExists = false;
            socket.emit('warning', 'The game does not exist')
        }
        console.log(roomExists)
        if (clients[1]) {
            roomFull = true;
            socket.emit('warning', 'The game is full')
        }
        console.log(roomFull)
        if (!roomFull && roomExists) {
            let isWhitePlayer = Math.random() >= 0.5;
            socket.join(roomID, () => {
                socket.emit('joined', isWhitePlayer);
                io.to(clients[0]).emit('joined', !isWhitePlayer);
            })
            socket.on('move', function (data) {
                socket.to(roomID).emit('move', data)
            });
        }
    })
}