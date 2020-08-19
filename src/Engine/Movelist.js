import React from 'react';
import './Movelist.css'

class Movelist extends React.Component {
    render() {
        const allMoves = this.props.allMoves;
        const activeTurn = this.props.activeTurn;
        const activePlayer = this.props.activePlayer;
        const turns = []
        for (let index = 0; index <= allMoves.length; index++) {
            let classNameWhite = ((activeTurn === index) ? "active " : "") + "half-column no-top-margin"; 
            let classNameBlack = ((activeTurn === index - 1) ? "active " : "") + "half-column no-top-margin"; 
            if (index % 2 === 1) {
                turns.push (
                    <li key={index} className="thin-border-top">
                        <div className={"row-flex align-top"}>
                            <div className={classNameBlack} onClick={()=>this.props.onClick(index-1)}>
                                {turnMovelist(allMoves[index-1])}
                            </div>
                            <div className={classNameWhite} onClick={()=>this.props.onClick(index)}>
                                {turnMovelist(allMoves[index])}
                            </div>
                        </div>
                    </li>
                )
            }
        }
        return (
            <div>Moves
                <div className = "movelist">
                    <div>
                        <ol className="no-margins">
                            <div className='row-flex'>
                                <div className={(activePlayer==='black' ? 'active ' : '') + 'half-column'}>
                                    Black
                                </div>
                                <div className={(activePlayer==='white' ? 'active ' : '') + 'half-column'}>
                                    White
                                </div>
                            </div>
                            {turns}
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}

function turnMovelist(turnMoves) {
    if(!turnMoves) {
        return;
    }
    else if(turnMoves[0]) {
        const items = []
        for (const [index, move] of turnMoves.entries()) {
            items.push(<div key={index}>{move.invalid ? <s>{move.notation()}</s>: move.notation()}</div>)            
        }
        return items;
    }
    else return (
        "-"
    )
}

export default Movelist;