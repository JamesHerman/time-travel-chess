import React from 'react';
import './Movelist.css'

class Movelist extends React.Component {
    render() {
        const allMoves = this.props.allMoves;
        const activeTurn = this.props.activeTurn;
        const activePlayer = this.props.activePlayer;
        const whiteTurns = [];
        const blackTurns = [];
        for (const [index,turnMoves] of allMoves.entries()) {
            let className = (activeTurn === index) ? "active" : null; 
            if (index % 2 === 1) {
                whiteTurns.push (<li className={className} onClick={() => this.props.onClick(index)} key={index}>{turnMovelist(turnMoves)}</li>)
            }
            if (index % 2 === 0) {
                blackTurns.push (<li className={className} onClick={() => this.props.onClick(index)} key={index}>{turnMovelist(turnMoves)}</li>)
            }
        }
        return (
            <div>Moves
                <div className = "row-flex movelist">
                    <div>
                        <span className={activePlayer==='black' ? 'active title' : 'title'}>Black</span>
                        <ol>
                            {blackTurns}
                        </ol>
                    </div>
                    <div>
                        <span className={activePlayer==='white' ? 'active title' : 'title'}>White</span>
                        <ol>
                            {whiteTurns}
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}

function turnMovelist(turnMoves) {
    const items = []
    for (const [index, move] of turnMoves.entries()) {
        items.push(<li key={index}>{move.invalid ? <s>{move.notation()}</s>: move.notation()}</li>)            
    }
    return (
        <ul>
            {items}
        </ul>
    )
}

export default Movelist;