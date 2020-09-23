import React from 'react'
import './Lobby.css'

class Lobby extends React.Component {
    constructor(props) {
        super();
        this.state = {gameNumber: ''}
    }

    handleChange(event) {
        let number = event.target.value;
        if (isNaN(number)) {
            this.setState({
                gameNumber: ''
            })
        }
        else {
            this.setState({
                gameNumber: event.target.value
            })
        }

    }

    render() {
        return (
            <div>
                Time Travel Chess<br/>
                <button className={this.props.waiting?'inactive lobby-button':'lobby-button'} onClick={() => this.props.create()}>Create Game</button>
                <div className={(this.props.waiting?'':'inactive ') + 'message'} >{this.props.gameID? 'Waiting for another player. Game number: ' + this.props.gameID: ''}</div>
                <input className={this.props.waiting?'inactive':''} onKeyUp={(event) => (this.state.gameNumber !== '' && event.keyCode === 13)? this.props.join(this.state.gameNumber):null} type="text" placeholder="Enter game number..." value={this.state.gameNumber} onChange={(event) => this.handleChange(event)}></input>
                <button className={this.props.waiting?'inactive lobby-button':'lobby-button'} onClick={() => this.state.gameNumber !== '' ? this.props.join(this.state.gameNumber):null}>Join Game</button><br/>
                <button className={this.props.waiting?'inactive lobby-button':'lobby-button'} onClick={() => this.props.singlePlayer()}>Single Player Game</button><br/>
            </div>
        )
    }
}

export default Lobby;