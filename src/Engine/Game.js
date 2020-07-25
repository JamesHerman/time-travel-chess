import React from 'react';
import {King, Queen, Bishop, Knight, Rook, Pawn} from './Pieces'
import ReactComponent from 'react';
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
        this.state = {
            whitePieces: {
                aRook: new Rook({row: 1, column: 1, color: "white"}),
                bKnight: new Knight({row: 1, column: 2, color: "white"}),
                cBishop: new Bishop({row: 1, column: 3, color: "white"}),
                queen: new Queen({row: 1, column: 4, color: "white"}),
                king: new King({row: 1, column: 5, color: "white"}),
                fBishop: new Bishop({row: 1, column: 6, color: "white"}),
                gKnight: new Knight({row: 1, column: 7, color: "white"}),
                hRook: new Rook({row: 1, column: 8, color: "white"}),
                aPawn: new Pawn({row: 2, column: 1, color: "white"}),
                bPawn: new Pawn({row: 2, column: 2, color: "white"}),
                cPawn: new Pawn({row: 2, column: 3, color: "white"}),
                dPawn: new Pawn({row: 2, column: 4, color: "white"}),
                ePawn: new Pawn({row: 2, column: 5, color: "white"}),
                fPawn: new Pawn({row: 2, column: 6, color: "white"}),
                gPawn: new Pawn({row: 2, column: 7, color: "white"}),
                hPawn: new Pawn({row: 2, column: 8, color: "white"}),
            },
            blackPieces: {
                aRook: new Rook({row: 8, column: 1, color: "black"}),
                bKnight: new Knight({row: 8, column: 2, color: "black"}),
                cBishop: new Bishop({row: 8, column: 3, color: "black"}),
                queen: new Queen({row: 8, column: 4, color: "black"}),
                king: new King({row: 8, column: 5, color: "black"}),
                fBishop: new Bishop({row: 8, column: 6, color: "black"}),
                gKnight: new Knight({row: 8, column: 7, color: "black"}),
                hRook: new Rook({row: 8, column: 8, color: "black"}),
                aPawn: new Pawn({row: 7, column: 1, color: "black"}),
                bPawn: new Pawn({row: 7, column: 2, color: "black"}),
                cPawn: new Pawn({row: 7, column: 3, color: "black"}),
                dPawn: new Pawn({row: 7, column: 4, color: "black"}),
                ePawn: new Pawn({row: 7, column: 5, color: "black"}),
                fPawn: new Pawn({row: 7, column: 6, color: "black"}),
                gPawn: new Pawn({row: 7, column: 7, color: "black"}),
                hPawn: new Pawn({row: 7, column: 8, color: "black"}),
            },
            timeline: [{
                boardState: [
                    [blackPieces.aRook,blackPieces.bKnight,blackPieces.cBishop,blackPieces.queen,blackPieces.king,blackPieces.fBishop,blackPieces.gKnight,blackPieces.hRook],
                    [blackPieces.aPawn,blackPieces.bPawn,blackPieces.cPawn,blackPieces.dPawn,blackPieces.ePawn,blackPieces.fPawn,blackPieces.gPawn,blackPieces.hPawn],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [whitePieces.aPawn,whitePieces.bPawn,whitePieces.cPawn,whitePieces.dPawn,whitePieces.ePawn,whitePieces.fPawn,whitePieces.gPawn,whitePieces.hPawn],
                    [whitePieces.aRook,whitePieces.bKnight,whitePieces.cBishop,whitePieces.queen,whitePieces.king,whitePieces.fBishop,whitePieces.gKnight,whitePieces.hRook]
                ],
                whiteToMove: true
            }],
            whiteToMove: true
        }
    }

    render() {
        return (
            <div>
                <Board >
                    boardState={timeline.boardState}
                </Board>
            </div>
        )
    }    
}

export default Game;