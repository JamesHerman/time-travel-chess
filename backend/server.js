const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io=require('socket.io')(server);
const path = require('path');
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

io.on('connection', (socket) => {
    socket.on('create', () => {
        createRoom(socket);
    })
    socket.on('join', (data) => {
        joinRoom(socket, data.roomID)
    })
    socket.on('rejoin', (data) => {
        rejoinRoom(socket, data.roomID)
    })
});

app.use(express.static(path.join(__dirname, '..', 'build')))

server.listen(port);



function createRoom(socket) {
    const roomID = getEmptyRoom();
    socket.join(roomID, () => {
        io.to(socket.id).emit('created', {
            roomID: roomID
        })
    })
    startGame(socket,roomID);
}

function getEmptyRoom() {
    let roomID = Math.floor(Math.random()*1000000);
    io.in(roomID).clients((error, clients) => {
        if (clients[0]) {
            roomID = getEmptyRoom();
        }
    })
    return roomID;
}

function rejoinRoom(socket, roomID) {
    let roomFull = false
    io.in(roomID).clients((error, clients) => {
        if (clients[1]) {
            roomFull = true;
            socket.emit('warning', 'The game is full')
        }
        if (!roomFull) {
            socket.join(roomID, () => {
                socket.emit('rejoined');
            })
            startGame(socket,roomID);
        }
    })
}

function joinRoom(socket, roomID) {
    let roomFull = false
    let roomExists = true
    io.in(roomID).clients((error, clients) => {
        if (!clients[0]) {
            roomExists = false;
            socket.emit('warning', 'The game does not exist')
        }
        if (clients[1]) {
            roomFull = true;
            socket.emit('warning', 'The game is full')
        }
        if (!roomFull && roomExists) {
            let isWhitePlayer = Math.random() >= 0.5;
            socket.join(roomID, () => {
                socket.emit('joined', isWhitePlayer);
                io.to(clients[0]).emit('joined', !isWhitePlayer);
            })
            startGame(socket,roomID);
        }
    })
}

function startGame(socket, roomID) {
    socket.on('move', function (data) {
        socket.to(roomID).emit('move', data)
    });
    socket.on('resetRequest', function() {
        socket.to(roomID).emit('resetRequest')
    });
    socket.on('resetConfirm', function() {
        socket.to(roomID).emit('resetConfirm')
    });
}