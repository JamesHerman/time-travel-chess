import React from 'react';
import {King, Queen, Bishop, Knight, Rook, Pawn} from './Pieces'
import Board from './Board'


/* Controls turn order, displays boards & UI elements
 Stores currently active player
 Even index = white to move, Odd index = black to move
 timeline - Stores 3D array of current and previous board states 
 Stores 2D array of moves for each board state
*/
class Game extends React.Component {
    constructor(props) {
        super(props);
        let whitePieces = [
            new Rook({row: 0, column: 1, color: "white"}),
            new Knight({row: 0, column: 2, color: "white"}),
            new Bishop({row: 0, column: 3, color: "white"}),
            new Queen({row: 0, column: 4, color: "white"}),
            new King({row: 0, column: 5, color: "white"}),
            new Bishop({row: 0, column: 6, color: "white"}),
            new Knight({row: 0, column: 7, color: "white"}),
            new Rook({row: 0, column: 8, color: "white"}),
            new Pawn({row: 1, column: 1, color: "white"}),
            new Pawn({row: 1, column: 2, color: "white"}),
            new Pawn({row: 1, column: 3, color: "white"}),
            new Pawn({row: 1, column: 4, color: "white"}),
            new Pawn({row: 1, column: 5, color: "white"}),
            new Pawn({row: 1, column: 6, color: "white"}),
            new Pawn({row: 1, column: 7, color: "white"}),
            new Pawn({row: 1, column: 8, color: "white"}),
        ];
        let blackPieces = [
            new Rook({row: 7, column: 1, color: "black"}),
            new Knight({row: 7, column: 2, color: "black"}),
            new Bishop({row: 7, column: 3, color: "black"}),
            new Queen({row: 7, column: 4, color: "black"}),
            new King({row: 7, column: 5, color: "black"}),
            new Bishop({row: 7, column: 6, color: "black"}),
            new Knight({row: 7, column: 7, color: "black"}),
            new Rook({row: 7, column: 8, color: "black"}),
            new Pawn({row: 6, column: 1, color: "black"}),
            new Pawn({row: 6, column: 2, color: "black"}),
            new Pawn({row: 6, column: 3, color: "black"}),
            new Pawn({row: 6, column: 4, color: "black"}),
            new Pawn({row: 6, column: 5, color: "black"}),
            new Pawn({row: 6, column: 6, color: "black"}),
            new Pawn({row: 6, column: 7, color: "black"}),
            new Pawn({row: 6, column: 8, color: "black"}),
        ];
        this.state = {
            whitePieces: whitePieces,
            blackPieces: blackPieces,            
            whiteToMove: true,
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

    render() {
        return (
            <div>
                <Board boardState={this.state.timeline[0].boardState}></Board>
            </div>
        )
    }    
}

export default Game;