import React from 'react'
import './Board.css'
//Renders board ui
class Board extends React.Component {
    render() {
        return (
            <div className = "board">
                {this.renderRow(7)}
                {this.renderRow(6)}
                {this.renderRow(5)}
                {this.renderRow(4)}
                {this.renderRow(3)}
                {this.renderRow(2)}
                {this.renderRow(1)}
                {this.renderRow(0)}
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
        if (piece) {
            if (piece === this.props.selectedPiece){
                className = "square " + color + " selected";
            }
            return(
                <div 
                    className={className}
                    onClick={() => this.props.onClick(row,column)}
                >{piece.color + " " + piece.type}</div>
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