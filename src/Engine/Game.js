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
            check: false,
            checkmate: false,
            turnNumber: 1,
            activeTurn: 1,
            whitePieces: whitePieces,
            blackPieces: blackPieces,
            selectedPiece: null,
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
        if (!this.state.checkmate) {
            const timeline = this.state.timeline;
            const activeTurn = this.state.activeTurn;
            const boardState = timeline.boardState[activeTurn];
            const clickedPiece = boardState[row][column];
            const selectedPiece = this.state.selectedPiece;
            const isActivePlayerTurn = timeline.whiteToMove[activeTurn] === this.state.whiteToMove;
            const legalMoves = selectedPiece ? selectedPiece.safeMoves(timeline,activeTurn) : null
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
            else if (selectedPiece && isActivePlayerTurn && isLegalMove) {
                let move = this.createMoveTo(row,column,selectedPiece,this.state.activeTurn)
                let nextTimeline = timeline.addMove(move)
                if (nextTimeline) {
                    this.updateTimeline(nextTimeline);                
                }
                else {
                    alert('This move would leave you in check')
                }
            }
        }
    }

    checkmateCheck(timeline, turn) {
        if (timeline.whiteToMove[turn]) {
            for (const piece of this.state.whitePieces) {
                if (piece.safeMoves(timeline,turn)[0]) {
                    return false;
                }
            }
        } 
        else {
            for (const piece of this.state.blackPieces) {
                if (piece.safeMoves(timeline,turn)[0]) {
                    return false;
                }
            }
        } 
        alert((timeline.whiteToMove[turn]? 'White' : 'Black') + " in checkmate")
        return true;
    }

    updateTimeline(nextTimeline) {
        let firstCheck = nextTimeline.firstCheck();
                //Update game state once a piece has moved
                if (firstCheck[0]) {
                    this.setState({
                        timeline: nextTimeline,
                        check: true,
                        checkmate: this.checkmateCheck(nextTimeline, firstCheck[1]),
                        turnNumber: nextTimeline.boardState.length - 1,
                        activeTurn: firstCheck[1],
                        whiteToMove: !this.state.whiteToMove,
                        selectedPiece: null,
                    })
                }
                else{
                    this.setState({
                        timeline: nextTimeline,
                        check: false,
                        turnNumber: nextTimeline.boardState.length - 1,
                        activeTurn: (this.state.whiteToMove === nextTimeline.whiteToMove[nextTimeline.whiteToMove.length - 1]) ? nextTimeline.boardState.length - 2 : nextTimeline.boardState.length - 1,
                        whiteToMove: !this.state.whiteToMove,
                        selectedPiece: null,
                    })
                }
    }

    //Creates a new move using the selected piece and a clicked row and column
    createMoveTo(row,column,selectedPiece,turnNumber) {
        let startLocation = selectedPiece.getLocation(this.state.timeline.boardState[turnNumber])
        let move = new Move({
            turnNumber: turnNumber,
            startRow: startLocation[0],
            startColumn: startLocation[1],
            endRow: row,
            endColumn: column,
            piece: selectedPiece,
        })
        return move;
    }



    //Selects a clicked piece
    selectPiece(clickedPiece) {
        this.setState({
            selectedPiece: clickedPiece
        })
    }

    

    backTurn() {
        if (this.state.check) {
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
        if (this.state.check) {
            alert("You cannot time travel while in check") 
        }
        else if (this.state.activeTurn < this.state.turnNumber) {
            this.setState({
                activeTurn: this.state.activeTurn + 1,
            })
        }
    }

    goToTurn(turnNumber) {
        if (this.state.check) {
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
        const activeBoardState = this.state.timeline.boardState[activeTurn];
        const finalBoardState = this.state.timeline.boardState[turnNumber]
        const activePlayer = this.state.whiteToMove ? 'white' : 'black';
        const selectedPiece = this.state.selectedPiece;
        const whiteToMove = this.state.timeline.whiteToMove[activeTurn];
        return (
            <div className={"game " + activePlayer}>
                <div>
                    <div className="row-flex">
                        <div>
                            <Board
                                isActivePlayerTurn={whiteToMove === (activePlayer === 'white')}
                                size="full"
                                boardState={activeBoardState}
                                selectedPiece={selectedPiece}
                                legalMoves={selectedPiece ? selectedPiece.safeMoves(this.state.timeline,activeTurn) : null}
                                onClick={(row,column) => this.handleClick(row,column)}
                            />
                            {(activeTurn > 0) ? <button onClick={() => this.backTurn()} value="Before">Before</button> : <button onClick={() => this.backTurn()} className="disabled" value="Before">Before</button>}
                            {(activeTurn < turnNumber) ? <button onClick={() => this.forwardTurn()} value="After">After</button> : <button onClick={() => this.forwardTurn()}  className="disabled" value="After">After</button>}
                        </div>
                        <div>
                            Final Board:
                            <Board
                                boardState={finalBoardState}
                                size="small"
                            />
                            <Movelist
                                activeTurn={activeTurn}
                                activePlayer={activePlayer}
                                allMoves = {moveList}
                                onClick={(turnNumber) => this.goToTurn(turnNumber)}
                            />
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }    
}

export default Game;