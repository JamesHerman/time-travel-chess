import React from 'react';
import {King, Queen, Bishop, Knight, Rook, Pawn} from './Pieces'
import Board from './Board'


/* Controls turn order, displays boards & UI elements
 Stores currently active player
 Even turn number = white to move, Odd turn number = black to move
 timeline - Stores 3D array of current and previous board states 
 Stores 2D array of moves for each board state
*/
class Game extends React.Component {
    constructor(props) {
        super(props);
        //Definining pieces early so they can be used when setting initial state
        let whitePieces = [
            new Rook({row: 0, column: 0, color: "white"}),
            new Knight({row: 0, column: 1, color: "white"}),
            new Bishop({row: 0, column: 2, color: "white"}),
            new Queen({row: 0, column: 3, color: "white"}),
            new King({row: 0, column: 4, color: "white"}),
            new Bishop({row: 0, column: 5, color: "white"}),
            new Knight({row: 0, column: 6, color: "white"}),
            new Rook({row: 0, column: 7, color: "white"}),
            new Pawn({row: 1, column: 0, color: "white"}),
            new Pawn({row: 1, column: 1, color: "white"}),
            new Pawn({row: 1, column: 2, color: "white"}),
            new Pawn({row: 1, column: 3, color: "white"}),
            new Pawn({row: 1, column: 4, color: "white"}),
            new Pawn({row: 1, column: 5, color: "white"}),
            new Pawn({row: 1, column: 6, color: "white"}),
            new Pawn({row: 1, column: 7, color: "white"}),
        ];
        let blackPieces = [
            new Rook({row: 7, column: 0, color: "black"}),
            new Knight({row: 7, column: 1, color: "black"}),
            new Bishop({row: 7, column: 2, color: "black"}),
            new Queen({row: 7, column: 3, color: "black"}),
            new King({row: 7, column: 4, color: "black"}),
            new Bishop({row: 7, column: 5, color: "black"}),
            new Knight({row: 7, column: 6, color: "black"}),
            new Rook({row: 7, column: 7, color: "black"}),
            new Pawn({row: 6, column: 0, color: "black"}),
            new Pawn({row: 6, column: 1, color: "black"}),
            new Pawn({row: 6, column: 2, color: "black"}),
            new Pawn({row: 6, column: 3, color: "black"}),
            new Pawn({row: 6, column: 4, color: "black"}),
            new Pawn({row: 6, column: 5, color: "black"}),
            new Pawn({row: 6, column: 6, color: "black"}),
            new Pawn({row: 6, column: 7, color: "black"}),
        ];
        this.state = {
            whiteToMove: true,
            turnNumber: 0,
            whitePieces: whitePieces,
            blackPieces: blackPieces,
            selectedPiece: null,
            timeline: [{
                boardState: [
                    whitePieces.slice(0,8),
                    whitePieces.slice(8,16),
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    blackPieces.slice(8,16),
                    blackPieces.slice(0,8)],
                whiteToMove: true
            }],
        }
    }

    handleClick(row,column) {
        //Timeline: temporary array to store changes to board state before commiting them to game state.
        const timeline = this.state.timeline.slice(0, this.state.turnNumber + 1)
        const boardState = timeline[this.state.turnNumber].boardState.map((arr) => arr.slice());
        const clickedPiece = boardState[row][column];
        const selectedPiece = this.state.selectedPiece;
        if (selectedPiece && !clickedPiece) {
            boardState[selectedPiece.row][selectedPiece.column] = null;
            boardState[row][column] = selectedPiece;
            selectedPiece.movedTo(row,column);
            this.setState({
                timeline: timeline.concat([{
                    boardState: boardState,
                    whiteToMove: !this.state.whiteToMove,
                }]),
                turnNumber: timeline.length,
                whiteToMove: !this.state.whiteToMove,
                selectedPiece: null,
            })
        }
        if (!selectedPiece && clickedPiece) {
            if ((clickedPiece.color === "white") === this.state.whiteToMove){
                this.setState({
                    selectedPiece: clickedPiece
                })
            }
        }
    }

    render() {
        const boardState=this.state.timeline[this.state.turnNumber].boardState;
        return (
            <div>
                <Board 
                    boardState={boardState}
                    selectedPiece={this.state.selectedPiece}
                    onClick={(row,column) => this.handleClick(row,column)}
                />
                {this.state.whiteToMove ? 'White' : 'Black'} to move
            </div>
        )
    }    
}

export default Game;