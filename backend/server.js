const express = require('express');
const app = express();
const helmet = require('helmet');
app.use(helmet())
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
    socket.on('move', function (data) {
        socket.to(roomID).emit('move', data)
    });
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