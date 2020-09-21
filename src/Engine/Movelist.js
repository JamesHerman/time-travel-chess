import React from 'react';
import './Movelist.css'

class Movelist extends React.Component {

    getClassName(turn) {
        return (
            (this.props.activeTurn === turn ? "active " : "") +
            (this.props.lastMoveNumber === turn ? "last-move " : "") +
            (this.props.tentativeMoveNumber === turn ? "tentative-move " : "") +
            "half-column no-top-margin move"
        )
    }
    render() {
        const allMoves = this.props.allMoves;
        const activePlayer = this.props.activePlayer;
        const turns = []
        let classNameDefault = "half-column no-top-margin move"
        for (let index = 0; index <= allMoves.length; index++) {
            let move = allMoves[index];
            let nextMove = allMoves[index + 1];
            if (move && move.piece.color === 'black' && nextMove && nextMove.piece.color === "white") {
                let classNameBlack = this.getClassName(index)
                let classNameWhite = this.getClassName(index + 1)
                turns.push(
                    <div key={index} className="thin-border-top">
                        <div className={"row-flex align-top"}>
                            {this.renderMove(move,classNameBlack, index)}
                            {this.renderMove(nextMove,classNameWhite, index + 1)}
                        </div>
                    </div>
                )
                index++
            }
            else if (move && move.piece.color === 'white') {
                let classNameWhite = this.getClassName(index)
                turns.push (
                    <div key={index} className="thin-border-top">
                        <div className={"row-flex align-top"}>
                            {this.renderMove(null,classNameDefault)}
                            {this.renderMove(move,classNameWhite, index)}
                        </div>
                    </div>
                )
            }
            else if (move) {
                let classNameBlack = this.getClassName(index)
                turns.push (
                    <div key={index} className="thin-border-top">
                        <div className={"row-flex align-top"}>
                            {this.renderMove(move,classNameBlack, index)}
                            {this.renderMove(null,classNameDefault)}
                        </div>
                    </div>
                )
            }
            else (
                turns.push (
                    <div key={index} className="thin-border-top">
                            <div className={"row-flex align-top"}>
                                {this.renderMove(null,classNameDefault)}
                                {this.renderMove(null,classNameDefault)}
                            </div>
                    </div>
                )
            )
        }
        return (
            <div>Moves
                <div className = "movelist">
                    <div className='row-flex'>
                        <div className={(activePlayer==='black' ? 'active ' : '') + 'half-column'}>
                            Black
                        </div>
                        <div className={(activePlayer==='white' ? 'active ' : '') + 'half-column'}>
                            White
                        </div>
                    </div>
                    {turns}
                </div>
            </div>
        )
    }

    renderMove(move, className, turn) {
        return (
            <div onClick={move? (()=>this.props.onClick(turn)):null} className={className}>
                {move ? move.invalid ? <s>{move.notation()}</s>: move.notation(): "-"}
            </div>
        )
    }
}


export default Movelist;