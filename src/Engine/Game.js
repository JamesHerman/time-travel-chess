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

    handleClick(row,column) {//Handles a click event on the main board
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

    checkmateCheck(timeline, turn) {//Tests all moves available to a player to see if there are any that do not lead to that player still being in check
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

    updateTimeline(nextTimeline) {//Updates the game state with nextTimeline as the new state
        let firstCheck = nextTimeline.firstCheck();
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

    createMoveTo(row,column,selectedPiece,turnNumber) {//Creates a new move to [row,column] using the selected piece
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



    selectPiece(clickedPiece) {//Selects a clicked piece
        this.setState({
            selectedPiece: clickedPiece
        })
    }

    

    backTurn() {//Decrements active turn by 1
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

    forwardTurn() {//Increments active turn by 1
        if (this.state.check) {
            alert("You cannot time travel while in check") 
        }
        else if (this.state.activeTurn < this.state.turnNumber) {
            this.setState({
                activeTurn: this.state.activeTurn + 1,
            })
        }
    }

    goToTurn(turnNumber) {//Jumps the active turn to turnNumber
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
        const timeline = this.state.timeline
        const activeTurn = this.state.activeTurn;
        const turnNumber = this.state.turnNumber;
        const moveList = timeline.moves;
        const activeBoardState = timeline.boardState[activeTurn];
        const finalBoardState = timeline.boardState[turnNumber]
        const activePlayer = this.state.whiteToMove ? 'white' : 'black';
        const selectedPiece = this.state.selectedPiece;
        const whiteToMove = timeline.whiteToMove[activeTurn];
        const legalMoves = selectedPiece ? selectedPiece.safeMoves(timeline,activeTurn) : null;
        return (
            <div className={"game " + activePlayer}>
                    <div className="row-flex">
                        <div>
                            <Board
                                playerToMove={whiteToMove ? 'white': 'black'}
                                activePlayer={activePlayer}
                                size="full"
                                boardState={activeBoardState}
                                selectedPiece={selectedPiece}
                                legalMoves={legalMoves}
                                onClick={(row,column) => this.handleClick(row,column)}
                            />
                            <div className="row-flex">
                                {this.renderTimeTravelButton('back')}
                                {this.renderConfirmButton()}
                                {this.renderTimeTravelButton('forward')}
                            </div>
                        </div>
                        <div className="margin-left-5P">
                            Final Board:
                            <Board
                                boardState={finalBoardState}
                                size="small"
                                onClick={()=>this.goToTurn((this.state.whiteToMove === timeline.whiteToMove[turnNumber])? turnNumber : turnNumber - 1)}
                            />
                            <Movelist
                                activeTurn={activeTurn}
                                activePlayer={activePlayer}
                                allMoves = {moveList}
                                onClick={(turn) => this.goToTurn(turn)}
                            />
                        </div>
                    </div>
            </div>
        )
    }

    renderConfirmButton() {
        return(
            <div className="width-33P"></div>
        )
    }

    renderTimeTravelButton(direction) {
        const activeTurn = this.state.activeTurn;
        const turnNumber = this.state.turnNumber;
        if (direction === 'forward') {
            const condition = (activeTurn < turnNumber);
            const className = 'forward button width-33P' + (condition?'':' disabled')
            return(
                <button onClick={()=>this.forwardTurn()} className={className}>&raquo;</button>
            )
        }
        if (direction === 'back') {
            const condition = (activeTurn > 0);
            const className = 'back button width-33P' + (condition?'':' disabled')
            return(
                <button onClick={()=>this.backTurn()} className={className}>&laquo;</button>
            )
        }
    }

}

export default Game;