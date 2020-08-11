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
        let pieceLocations = {
            black: {
                king: [[7,4]],
                queen: [[7,3]],
                bishop: {queenside: [[7,2]], kingside: [[7,5]]},
                knight: {queenside: [[7,1]], kingside: [[7,6]]},
                rook:{queenside: [[7,0]], kingside: [[7,7]]},
                pawn: {a: [[6,0]], b: [[6,1]], c: [[6,2]], d: [[6,3]], e:[[6,4]], f:[[6,5]], g:[[6,6]], h: [[6,7]]}
            },
            white: {
                king: [[0,4]],
                queen: [[0,3]],
                bishop: {queenside: [[0,2]], kingside: [[0,5]]},
                knight: {queenside: [[0,1]], kingside: [[0,6]]},
                rook:{queenside: [[0,0]], kingside: [[0,7]]},
                pawn: {a: [[1,0]], b: [[1,1]], c: [[1,2]], d: [[1,3]], e:[[1,4]], f:[[1,5]], g:[[1,6]], h: [[1,7]]}
            },
        }
        let whitePieces = [
            new Rook({location: pieceLocations.white.rook.queenside, color: "white"}),
            new Knight({location: pieceLocations.white.knight.queenside, color: "white"}),
            new Bishop({location: pieceLocations.white.bishop.queenside, color: "white"}),
            new Queen({location: pieceLocations.white.queen, color: "white"}),
            new King({location: pieceLocations.white.king, color: "white"}),
            new Bishop({location: pieceLocations.white.bishop.kingside, color: "white"}),
            new Knight({location: pieceLocations.white.knight.kingside, color: "white"}),
            new Rook({location: pieceLocations.white.rook.kingside, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.a, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.b, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.c, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.d, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.e, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.f, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.g, color: "white"}),
            new Pawn({location: pieceLocations.white.pawn.h, color: "white"}),
        ];
        let blackPieces = [
            new Rook({location: pieceLocations.black.rook.queenside, color: "black"}),
            new Knight({location: pieceLocations.black.knight.queenside, color: "black"}),
            new Bishop({location: pieceLocations.black.bishop.queenside, color: "black"}),
            new Queen({location: pieceLocations.black.queen, color: "black"}),
            new King({location: pieceLocations.black.king, color: "black"}),
            new Bishop({location: pieceLocations.black.bishop.kingside, color: "black"}),
            new Knight({location: pieceLocations.black.knight.kingside, color: "black"}),
            new Rook({location: pieceLocations.black.rook.kingside, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.a, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.b, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.c, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.d, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.e, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.f, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.g, color: "black"}),
            new Pawn({location: pieceLocations.black.pawn.h, color: "black"}),
        ];
        this.state = {
            whiteToMove: true,
            checkOnTurn: null,
            turnNumber: 0,
            activeTurn: 0,
            whitePieces: whitePieces,
            blackPieces: blackPieces,
            selectedPiece: {
                piece: null,
                row: null,
                column: null,
            },
            timeline: { // Each property of timeline is an array with index = turn number. ie: timeline.moves[5] is a list of moves made on turn 
                boardState: [[
                    whitePieces.slice(0,8),
                    whitePieces.slice(8,16),
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    blackPieces.slice(8,16),
                    blackPieces.slice(0,8)]],
                whiteToMove: [true],
                moves: [[]],
                whiteInCheck: [false],
                blackInCheck: [false],
                pieceLocations: pieceLocations
            },
        }
    }

    handleClick(row,column) {
        //Timeline: temporary array to store changes to board state before commiting them to game state.
        const timeline = this.state.timeline;
        const activeTurn = this.state.activeTurn;
        const boardState = timeline.boardState[activeTurn];
        const clickedPiece = boardState[row][column];
        const selectedPiece = this.state.selectedPiece;
        const moves = timeline.moves[activeTurn];
        const isActivePlayerTurn = timeline.whiteToMove[activeTurn] === this.state.whiteToMove;
        const legalMoves = selectedPiece.piece ? selectedPiece.piece.legalMoves(boardState,selectedPiece.row,selectedPiece.column) : null
        let isLegalMove = false;
        if (legalMoves) {
            for (const space of legalMoves) {
                if (space[0] === row && space[1] === column) {
                    isLegalMove = true;
                }
            }
        }

        //Select a clicked piece matching active player color
        if (clickedPiece && (clickedPiece.color === "white") === this.state.whiteToMove) {
            this.selectPiece(clickedPiece,row,column);
        }

        //move if a piece is selected
        else if (selectedPiece.piece && isActivePlayerTurn && isLegalMove) {
            let move = this.createMoveTo(row,column,selectedPiece)
            const activeTurn = this.state.activeTurn;
            let tempTimeline = this.timelineAfterMove(activeTurn,timeline,move)
            let turnCounter = 0;
            let moveIntoCheck = false;
            let isCheck = false;
            let whiteActive = this.state.whiteToMove;
            for (turnCounter = 0; turnCounter < tempTimeline.boardState.length; turnCounter++) {
                let whiteInCheck = tempTimeline.whiteInCheck[turnCounter];
                let blackInCheck = tempTimeline.blackInCheck[turnCounter];
                let whiteToMove = tempTimeline.whiteToMove[turnCounter];
                if (turnCounter > activeTurn) {
                    if ((whiteInCheck && whiteActive&& !whiteToMove) || (blackInCheck && !whiteActive && whiteToMove)){
                        moveIntoCheck = true;
                        break;
                    }
                    if((whiteInCheck && !whiteToMove) || (blackInCheck && whiteToMove)) {
                        turnCounter = turnCounter - 1;
                        isCheck = true;
                        break;
                    } else if ((whiteInCheck || blackInCheck) && turnCounter === tempTimeline.boardState.length - 1) {
                        isCheck = true;
                        break;
                    }
                }
            }
            if (turnCounter === tempTimeline.boardState.length) {
                turnCounter--;
            }
            if (moveIntoCheck) {
                alert("You cannot move into check. This move would put your king in check on turn " + turnCounter);
                moves.pop()
            } 
            //Update game state once a piece has moved
            else if (isCheck && !moveIntoCheck) {
                this.setState({
                    timeline: tempTimeline,
                    checkOnTurn: turnCounter,
                    turnNumber: tempTimeline.boardState.length - 1,
                    activeTurn: turnCounter,
                    whiteToMove: !this.state.whiteToMove,
                    selectedPiece: {
                        piece: null,
                        row: null,
                        column: null,
                    },
                })
            }
            else if (!moveIntoCheck){
                this.setState({
                    timeline: tempTimeline,
                    checkOnTurn: null,
                    turnNumber: tempTimeline.boardState.length - 1,
                    activeTurn: tempTimeline.boardState.length - 1,
                    whiteToMove: !this.state.whiteToMove,
                    selectedPiece: {
                        piece: null,
                        row: null,
                        column: null,
                    },
                })
            }
        }
    }

    timelineAfterMove(startTurn,timeline,move) {        
        let blackKing = this.state.blackPieces[4];
        let whiteKing = this.state.whitePieces[4];
        let boardStates = timeline.boardState.slice();
        let blackInCheck = timeline.blackInCheck.slice();
        let whiteInCheck = timeline.whiteInCheck.slice();
        let whiteToMove = timeline.whiteToMove.slice();
        let moves = timeline.moves.slice();
        moves[startTurn].push(move);
        let tempTimeline = {
            boardState: boardStates,
            moves: moves,
            whiteToMove: whiteToMove,
            whiteInCheck: whiteInCheck,
            blackInCheck: blackInCheck,
        }
        for (let turn = startTurn; turn <= this.state.turnNumber; turn++) {
            let boardBefore = boardStates[turn].map((row) => row.slice());
            let boardAfter = boardBefore.map((row) => row.slice());
            this.state.whitePieces.forEach(function(piece) {
                piece.moved = false;
            })
            this.state.blackPieces.forEach(function(piece) {
                piece.moved = false;
            })
            for (const move of moves[turn]) {
                if (move.valid(boardBefore,boardAfter)) {
                    boardAfter[move.startRow][move.startColumn] = null;
                    boardAfter[move.endRow][move.endColumn] = move.piece;
                    if ((whiteToMove[turn] && !whiteKing.inCheck(boardAfter))||(!whiteToMove[turn] && !blackKing.inCheck(boardAfter))) {
                        move.piece.moved = true;
                    }
                    else {
                        boardAfter[move.startRow][move.startColumn] = move.piece;
                        boardAfter[move.endRow][move.endColumn] = null;
                    }
                }
            }
            
            //Update
            if (turn <= this.state.turnNumber || moves[turn][0] || moves[turn-1][0]) {
                boardStates[turn + 1] = boardAfter;
                whiteToMove[turn + 1] = turn % 2 === 1;
                if (moves[turn + 1] === undefined) {
                    moves[turn + 1] = [];
                }
            }
            if (turn <= boardStates.length) {
                whiteInCheck[turn + 1] = whiteKing.inCheck(boardAfter);
                blackInCheck[turn + 1] = blackKing.inCheck(boardAfter);
            }
        }
        return tempTimeline;
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
        if (this.state.checkOnTurn) {
           alert("You cannot time travel while in check") 
        }
        else if (this.state.activeTurn > 0) {
            const previousTurn = this.state.activeTurn - 1;
            this.setState({
                activeTurn: previousTurn,
            })
        }
    }

    forwardTurn() {
        if (this.state.checkOnTurn) {
            alert("You cannot time travel while in check") 
        }
        else if (this.state.activeTurn < this.state.turnNumber) {
            this.setState({
                activeTurn: this.state.activeTurn + 1,
            })
        }
    }

    render() {
        const boardState=this.state.timeline.boardState[this.state.activeTurn];
        const activePlayer=this.state.whiteToMove ? 'white' : 'black';
        const selectedPiece=this.state.selectedPiece;
        const whiteToMove = this.state.timeline.whiteToMove[this.state.activeTurn];
        return (
            <div>
                Time Travel Chess ~{'\n'}
                Turn: {this.state.activeTurn} &nbsp;
                <Board
                    activePlayer={activePlayer}
                    isActivePlayerTurn={whiteToMove === this.state.whiteToMove}
                    boardState={boardState}
                    selectedPiece={this.state.selectedPiece.piece}
                    legalMoves={selectedPiece.piece ? selectedPiece.piece.legalMoves(boardState,selectedPiece.row,selectedPiece.column) : null}
                    onClick={(row,column) => this.handleClick(row,column)}
                />
                <button onClick={() => this.backTurn()} value="Before">Before</button>
                {whiteToMove ? ' White' : 'Black '} to move&nbsp;
                {(this.state.activeTurn < this.state.turnNumber) ? <button onClick={() => this.forwardTurn()} value="After">After</button> : null}
                {this.state.blackPieces[4].inCheck(boardState) ? "Check" : "No Check"}         
            </div>
        )
    }    
}

export default Game;