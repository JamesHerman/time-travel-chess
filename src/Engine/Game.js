import React from 'react';
import {King, Queen, Bishop, Knight, Rook, Pawn} from './Pieces'
import Timeline from './Timeline'
import Board from './Board';
import Move from './Move';
import Movelist from './Movelist';
import './Game.css';


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
            new Rook({color: "white"}),
            new Knight({color: "white"}),
            new Bishop({color: "white"}),
            new Queen({color: "white"}),
            new King({color: "white"}),
            new Bishop({color: "white"}),
            new Knight({color: "white"}),
            new Rook({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
            new Pawn({color: "white"}),
        ];
        let blackPieces = [
            new Rook({color: "black"}),
            new Knight({color: "black"}),
            new Bishop({color: "black"}),
            new Queen({color: "black"}),
            new King({color: "black"}),
            new Bishop({color: "black"}),
            new Knight({color: "black"}),
            new Rook({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
            new Pawn({color: "black"}),
        ];
        this.state = {
            whiteToMove: true,
            checkOnTurn: null,
            turnNumber: 1,
            activeTurn: 1,
            whitePieces: whitePieces,
            blackPieces: blackPieces,
            selectedPiece: {
                piece: null,
                row: null,
                column: null,
            },
            timeline: new Timeline({ // Each property of timeline is an array with index = turn number. ie: timeline.moves[5] is a list of moves made on turn 5
                boardState: [[
                    whitePieces.slice(0,8),
                    whitePieces.slice(8,16),
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    blackPieces.slice(8,16),
                    blackPieces.slice(0,8)],
                    [whitePieces.slice(0,8),
                    whitePieces.slice(8,16),
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    blackPieces.slice(8,16),
                    blackPieces.slice(0,8)]],
                whiteToMove: [false,true],
                moves: [[],[]],
                whiteInCheck: [false,false],
                blackInCheck: [false,false],
            }),
        }
    }

    handleClick(row,column) {
        //Timeline: temporary array to store changes to board state before commiting them to game state.
        const timeline = this.state.timeline;
        const activeTurn = this.state.activeTurn;
        const boardState = timeline.boardState[activeTurn];
        const clickedPiece = boardState[row][column];
        const selectedPiece = this.state.selectedPiece;
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
            let move = this.createMoveTo(row,column,selectedPiece,this.state.turnNumber)
            const activeTurn = this.state.activeTurn;
            let tempTimeline = timeline.timelineAfterMove(activeTurn,move,this.state.whitePieces,this.state.blackPieces)
            let whiteActive = this.state.whiteToMove;
            let firstCheck = tempTimeline.firstCheck();
            
            if (firstCheck[0] === (whiteActive?'white':'black')) {
                alert("You cannot move into check. This move would put you into check on turn " + firstCheck[1]);
            } 
            //Update game state once a piece has moved
            else if (firstCheck[0]) {
                this.setState({
                    timeline: tempTimeline,
                    checkOnTurn: firstCheck[1],
                    turnNumber: tempTimeline.boardState.length - 1,
                    activeTurn: firstCheck[1],
                    whiteToMove: !this.state.whiteToMove,
                    selectedPiece: {
                        piece: null,
                        row: null,
                        column: null,
                    },
                })
            }
            else {
                this.setState({
                    timeline: tempTimeline,
                    checkOnTurn: null,
                    turnNumber: tempTimeline.boardState.length - 1,
                    activeTurn: (this.state.whiteToMove === tempTimeline.whiteToMove[tempTimeline.whiteToMove.length - 1]) ? tempTimeline.boardState.length - 2 : tempTimeline.boardState.length - 1,
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



    

    //Creates a new move using the selected piece and a clicked row and column
    createMoveTo(row,column,selectedPiece,turnNumber) {
        let move = new Move({
            turnNumber: turnNumber,
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

    goToTurn(turnNumber) {
        if (this.state.checkOnTurn) {
            alert("You cannot time travel while in check") 
        }
        else {
            this.setState({
                activeTurn: turnNumber
            })
        }
    }

    render() {
        const activeTurn = this.state.activeTurn;
        const turnNumber = this.state.turnNumber;
        const moveList = this.state.timeline.moves;
        const boardState = this.state.timeline.boardState[this.state.activeTurn];
        const activePlayer = this.state.whiteToMove ? 'white' : 'black';
        const selectedPiece = this.state.selectedPiece;
        const whiteToMove = this.state.timeline.whiteToMove[this.state.activeTurn];
        return (
            <div className={"game " + activePlayer}>
                <div>
                    <div className="row-flex">
                        <div>
                        <Board
                            activePlayer={activePlayer}
                            isActivePlayerTurn={whiteToMove === (activePlayer === 'white')}
                            boardState={boardState}
                            selectedPiece={selectedPiece.piece}
                            legalMoves={selectedPiece.piece ? selectedPiece.piece.legalMoves(boardState,selectedPiece.row,selectedPiece.column) : null}
                            onClick={(row,column) => this.handleClick(row,column)}
                        />
                        {(activeTurn > 0) ? <button onClick={() => this.backTurn()} value="Before">Before</button> : <button onClick={() => this.backTurn()} className="disabled" value="Before">Before</button>}
                        {(activeTurn < turnNumber) ? <button onClick={() => this.forwardTurn()} value="After">After</button> : <button onClick={() => this.forwardTurn()}  className="disabled" value="After">After</button>}
                    </div>
                    <Movelist
                        activeTurn={activeTurn}
                        allMoves = {moveList}
                        onClick={(turnNumber) => this.goToTurn(turnNumber)}
                    />
                    </div>
                </div>
            </div>
        )
    }    
}

export default Game;