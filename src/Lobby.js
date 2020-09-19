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
                <button className={this.props.waiting?'inactive lobby-button':'lobby-button'} onClick={() => this.props.create()}>Create Game</button><br/>
                <span className={this.props.waiting?'':'inactive'} >{this.props.gameID? 'Waiting for another player. Game number: ' + this.props.gameID: ''}</span><br/>
                <input className={this.props.waiting?'inactive':''} type="text" placeholder="Enter game number..." value={this.state.gameNumber} onChange={(event) => this.handleChange(event)}></input>
                <button className={this.props.waiting?'inactive lobby-button':'lobby-button'} onClick={() => this.state.gameNumber !== '' ? this.props.join(this.state.gameNumber):null}>Join Game</button><br/>
            </div>
        )
    }
}

export default Lobby;