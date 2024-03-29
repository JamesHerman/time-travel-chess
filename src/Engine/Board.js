import React from 'react'
import './Board.css'
//Renders board ui
class Board extends React.Component {
    render() {
        if (this.props.playingBlack) {
            return(
                <div className="Board">
                    <div className={this.props.size}>
                        {this.renderRow(0)}
                        {this.renderRow(1)}
                        {this.renderRow(2)}
                        {this.renderRow(3)}
                        {this.renderRow(4)}
                        {this.renderRow(5)}
                        {this.renderRow(6)}
                        {this.renderRow(7)}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="Board">
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
                </div>
            )
        }
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
    renderTag(row,column) {
        let tag = '';
        if (column === 0) {
            tag=row+1;
        }
        if ((row === 0 && !this.props.playingBlack)||(row === 0 && this.props.playingBlack)) {
            tag=String.fromCharCode(97+column);
        }
        if(column===0 && ((row===0 &&!this.props.playingBlack))) {
            tag="a1"
        } 
        if(column===0 && (row===7 && this.props.playingBlack)) {
            tag="a8"
        }
        return(
            <div className="tag">
                {tag}                
            </div>
        )
    }
    renderSquare(row,column) {
        const piece = this.props.boardState[row][column];

        //Color black squares (Odd row and column or even row and column) black
        let color = "white";
        if ((row % 2 === 0 && column % 2 === 0)||(row % 2 === 1 && column % 2 === 1)) {
            color = "black"
        } 
        let className = "square " + color;
        
        //Highlight legal moves of selected piece
        if (this.props.selectedPiece) {
            for (const space of this.props.legalMoves) {
                if (space[0] === row && space[1] === column) {
                    className = "square " + color + " legalMove";
                }
            }
        }

        //Generate JSX for the square
        if (piece) {
            if (piece === this.props.selectedPiece){
                className = "square " + color + " selected";
            }
            return(
                <div 
                    className={className}
                    onClick={() => this.props.onClick(row,column)}
                >{this.renderTag(row,column)}{piece.image}</div>
            )
        }
        else{
            return(
                <div 
                    className={className}
                    onClick={() => this.props.onClick(row,column)}
                >{this.renderTag(row,column)}</div>
            )
        }
    }
}

export default Board