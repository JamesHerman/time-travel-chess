import React from 'react';
import {King, Queen, Bishop, Knight, Rook, Pawn} from './Pieces'
import Board from './Board'
import Move from './Move';


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
            selectedPiece: {
                piece: null,
                row: null,
                column: null,
            },
            activeTurn: 0,
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
                whiteToMove: true,
                moves: [],
            }],
        }
    }

    handleClick(row,column) {
        //Timeline: temporary array to store changes to board state before commiting them to game state.
        const tempTimeline = this.state.timeline.slice(0, this.state.turnNumber + 1)
        const boardState = tempTimeline[this.state.activeTurn].boardState;
        const clickedPiece = boardState[row][column];
        const selectedPiece = this.state.selectedPiece;
        const moves = tempTimeline[this.state.activeTurn].moves;

        //Select a clicked piece matching active player color
        if (clickedPiece && (clickedPiece.color === "white") === this.state.whiteToMove) {
            this.selectPiece(clickedPiece,row,column);
        }

        //move if a piece is selected
        else if (selectedPiece.piece) {
            let move = this.createMoveTo(row,column,selectedPiece)
            moves.push(move)
            this.executeMoves(this.state.activeTurn,tempTimeline)


            this.setState({
                timeline: tempTimeline,
                turnNumber: tempTimeline.length - 1,
                activeTurn: tempTimeline.length - 1,
                whiteToMove: !this.state.whiteToMove,
                selectedPiece: {
                    piece: null,
                    row: null,
                    column: null
                },
            })
        }
    }

    executeMoves(startTurn,tempTimeline) {
        for (let turn = startTurn; turn <= this.state.turnNumber; turn++) {
            let turnMoves = tempTimeline[turn].moves;
            let boardBefore = tempTimeline[turn].boardState.map((row) => row.slice());
            let boardAfter = boardBefore.map((row) => row.slice());
            turnMoves.forEach(function(move) {
                if (boardBefore[move.startRow][move.startColumn] === move.piece) {
                    boardBefore[move.startRow][move.startColumn] = null;
                    if (boardAfter[move.startRow][move.startColumn] === move.piece) {
                        boardAfter[move.startRow][move.startColumn] = null;
                    }
                    boardAfter[move.endRow][move.endColumn] = move.piece;
                }
            })
            if (turn < this.state.turnNumber) {
                tempTimeline[turn + 1].boardState = boardAfter;
            }
            else {
                tempTimeline.push({
                    boardState: boardAfter,
                    whiteToMove: !this.state.whiteToMove,
                    moves: []
                })
            }
        }
    }

    //Creates a new move using the selected piece and a clicked row and column
    createMoveTo(row,column,selectedPiece) {
        let move = new Move({
            startRow: selectedPiece.row,
            startColumn: selectedPiece.column,
            endRow: row,
            endColumn: column,
            piece: selectedPiece.piece,
        })
        return move;
    }

    //Selects a clicked piece
    selectPiece(clickedPiece, row, column) {
        this.setState({
            selectedPiece: {
                piece: clickedPiece,
                row: row,
                column: column,
            }
        })
    }

    

    backTurn() {
        if (this.state.activeTurn > 1) {
            const previousTurn = this.state.activeTurn - 2;
            this.setState({
                activeTurn: previousTurn,
            })
        }
    }

    forwardTurn() {
        if (this.state.activeTurn < this.state.turnNumber - 1) {
            this.setState({
                activeTurn: this.state.activeTurn + 2,
            })
        }
    }

    render() {
        const boardState=this.state.timeline[this.state.activeTurn].boardState;
        return (
            <div>
                <Board 
                    boardState={boardState}
                    selectedPiece={this.state.selectedPiece.piece}
                    onClick={(row,column) => this.handleClick(row,column)}
                />
                <button onClick={() => this.backTurn()} value="Before">Before</button>
                {this.state.timeline[this.state.activeTurn].whiteToMove ? ' White' : 'Black '} to move&nbsp;
                <button onClick={() => this.forwardTurn()} value="After">After</button>
            </div>
        )
    }    
}

export default Game;