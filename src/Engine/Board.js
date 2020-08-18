import React from 'react'
import './Board.css'
//Renders board ui
class Board extends React.Component {
    render() {
        return (
            <div>
                <div className={this.props.size}>
                    {this.renderRow(7)}
                    {this.renderRow(6)}
                    {this.renderRow(5)}
                    {this.renderRow(4)}
                    {this.renderRow(3)}
                    {this.renderRow(2)}
                    {this.renderRow(1)}
                    {this.renderRow(0)}
                </div>
                {this.props.activePlayer === 'white' ? this.props.isActivePlayerTurn ? 'White' : 'Black' : this.props.isActivePlayerTurn ? 'Black' : 'White'} to move&nbsp;
            </div>
            
        )
    }
    renderRow(index) {
        return(
            <div className="board-row">
                {this.renderSquare(index,0)}
                {this.renderSquare(index,1)}
                {this.renderSquare(index,2)}
                {this.renderSquare(index,3)}
                {this.renderSquare(index,4)}
                {this.renderSquare(index,5)}
                {this.renderSquare(index,6)}
                {this.renderSquare(index,7)}
            </div>
        )
    }
    renderSquare(row,column) {
        const piece = this.props.boardState[row][column];

        let color = "white";
        if ((row % 2 === 0 && column % 2 === 0)||(row % 2 === 1 && column % 2 === 1)) {
            color = "black"
        } 
        let className = "square " + color;
        
        if (this.props.selectedPiece && this.props.isActivePlayerTurn) {
            for (const space of this.props.legalMoves) {
                if (space[0] === row && space[1] === column) {
                    className = "square " + color + " legalMove";
                }
            }
        }

        if (piece) {
            if (piece === this.props.selectedPiece){
                className = "square " + color + " selected";
            }
            return(
                <div 
                    className={className}
                    onClick={() => this.props.onClick(row,column)}
                ><img className = "piece" src={piece.image} alt={piece.color + " " + piece.type}></img></div>
            )
        }
        else{
            return(
                <div 
                    className={className}
                    onClick={() => this.props.onClick(row,column)}
                />
            )
        }
    }
}

export default Board