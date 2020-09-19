import React from 'react';
import Game from './Engine/Game'
import Lobby from './Lobby'
import './App.css';
import socketIOClient from 'socket.io-client'
class App extends React.Component {
  constructor(props) {
    super()
    const wsURL = 'ws://localhost:3030';
    const socket = socketIOClient(wsURL)
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
    })
    socket.on('joined', (isWhitePlayer) => {
      this.setState({
        isWhitePlayer: isWhitePlayer,
        gameStarted:true
      })
    })
    socket.emit('create')
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
  }

  render() {
    if(this.state.gameStarted) {
      return (
        <div className="App">
            <div>
              <Game 
                connection={this.state.socket}
                playerColor={this.state.isWhitePlayer?'white':'black'}
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
              />
            </div>
        </div>
      )
    }
  }
}

export default App;
