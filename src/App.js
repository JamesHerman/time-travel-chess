import React from 'react';
import Game from './Engine/Game'
import Lobby from './Lobby'
import './App.css';
import io from 'socket.io-client'
class App extends React.Component {
  constructor(props) {
    super()
    const socket = io()
    socket.on('connect', () => {
      console.log('connected')
    });
    this.state = {
      socket: socket,
      gameID: '',
      gameStarted: false
    }
  }

  createGame() {
    const socket = this.state.socket;
    socket.on('created', (data) => {
      this.setState({
        waiting: true,
        gameID: data.roomID,
      })
      this.autoReconnect(data.roomID)
    })
    socket.on('joined', (isWhitePlayer) => {
      this.setState({
        isWhitePlayer: isWhitePlayer,
        gameStarted:true
      })
    })
    socket.emit('create')
  }

  autoReconnect(gameID) {
    const socket = this.state.socket;
    socket.on('reconnect', () => {
      socket.emit('rejoin', {roomID: gameID})
    })
  }

  joinGame(gameID) {
    const socket = this.state.socket;
    socket.on('joined', (isWhitePlayer) => {
      this.setState({
        isWhitePlayer: isWhitePlayer,
        gameStarted:true
      })
    })
    socket.emit('join', {roomID: gameID})
    this.autoReconnect(gameID)
  }

  singlePlayerGame() {
    this.state.socket.disconnect();
    this.setState({
      isWhitePlayer:true,
      gameStarted:true,
      singlePlayer:true
    })
  }

  render() {
    if(this.state.gameStarted) {
      return (
        <div className="App">
            <div>
              <Game 
                connection={this.state.socket}
                playerColor={this.state.isWhitePlayer?'white':'black'}
                singlePlayer={this.state.singlePlayer}
              />
            </div>
        </div>
      );
    }
    else {
      return (
        <div className="App">
            <div>
              <Lobby 
                create={()=> this.createGame()}
                join={(gameID) => this.joinGame(gameID)}
                waiting={this.state.waiting}
                gameID={this.state.gameID}
                singlePlayer={()=> this.singlePlayerGame()}
              />
            </div>
        </div>
      )
    }
  }
}

export default App;
