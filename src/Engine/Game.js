import React from 'react';
import {King, Queen, Bishop, Knight, Rook, Pawn} from './Pieces'
import Timeline from './Timeline'
import Board from './Board';
import Move from './Move';
import Movelist from './Movelist';
import Dialog from './Dialog';
import './Game.css';


/* Controls turn order, displays boards & UI elements
 Stores currently active player
 Even turn number = white to move, Odd turn number = black to move
 timeline - Stores 3D array of current and previous board states 
 Stores 2D array of moves for each board state
*/
class Game extends React.Component {
    constructor(props) {
        super();
        //Definining pieces early so they can be used when setting initial state
        const pieces = {
        white: [
            new Rook({id:1,color: "white"}),
            new Knight({id:2,color: "white"}),
            new Bishop({id:3,color: "white"}),
            new Queen({id:4,color: "white"}),
            new King({id:5,color: "white"}),
            new Bishop({id:6,color: "white"}),
            new Knight({id:7,color: "white"}),
            new Rook({id:8,color: "white"}),
            new Pawn({id:9,color: "white"}),
            new Pawn({id:10,color: "white"}),
            new Pawn({id:11,color: "white"}),
            new Pawn({id:12,color: "white"}),
            new Pawn({id:13,color: "white"}),
            new Pawn({id:14,color: "white"}),
            new Pawn({id:15,color: "white"}),
            new Pawn({id:16,color: "white"}),
        ],
        black: [
            new Rook({id:17,color: "black"}),
            new Knight({id:18,color: "black"}),
            new Bishop({id:19,color: "black"}),
            new Queen({id:20,color: "black"}),
            new King({id:21,color: "black"}),
            new Bishop({id:22,color: "black"}),
            new Knight({id:23,color: "black"}),
            new Rook({id:24,color: "black"}),
            new Pawn({id:25,color: "black"}),
            new Pawn({id:26,color: "black"}),
            new Pawn({id:27,color: "black"}),
            new Pawn({id:28,color: "black"}),
            new Pawn({id:29,color: "black"}),
            new Pawn({id:30,color: "black"}),
            new Pawn({id:31,color: "black"}),
            new Pawn({id:32,color: "black"}),
        ]};
        this.state = {
            whiteToMove: true,
            check: false,
            checkmate: false,
            turnNumber: 1,
            activeTurn: 1,
            dialogs: [],
            selectedPiece: null,
            reset: {
                self: false,
                opponent: false
            },
            timeline: new Timeline({ // Each property of timeline is an array with index = turn number. ie: timeline.moves[5] is a list of moves made on turn 5
                moves: [],
                pieces: pieces,
            }),
        }
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        })
    }

    componentDidMount() {
        this.listenForMove();
        this.listenForReset();
        if (this.props.howToPlay) {
            this.openTutorial();
        }
    }

    listenForMove() {//Set up move listener for moves from other player
        this.props.connection.on('move', data => {
            let message = JSON.parse(data);
            if (message.move) {
                this.executeMove(message.move)
                this.setState({
                    lastMoveNumber: message.move.turnNumber,
                })
            }
        })
    }

    listenForReset() {
        this.props.connection.on('resetRequest', () => {
            if (this.state.reset.self) {
                this.newGame();
            }
            else{
                this.setState({
                    reset: {
                        opponent: true
                    }
                })
                this.openDialog('Your opponent would like to reset the game.', (verified) => this.resetGame(verified));
            }
        })
    }

    handleKeyPress(event) {
        if (!event.repeat) {
            if (event.keyCode === 13 && this.state.tentativeTimeline) {
                this.confirmMove();
            } else if (event.keyCode === 37) {
                this.backTurn();
            } else if (event.keyCode === 39) {
                this.forwardTurn()
            }
        }
    }

    handleClick(row,column) {//Handles a click event on the main board
        if (!this.state.checkmate && !this.state.tentativeTimeline &&(this.props.connection.connected || this.props.singlePlayer)) {
            const timeline = this.state.timeline;
            const activeTurn = this.state.activeTurn;
            const boardState = timeline.boardState[activeTurn];
            const clickedPiece = boardState[row][column];
            const selectedPiece = this.state.selectedPiece;
            const legalMoves = selectedPiece ? selectedPiece.safeMoves(timeline,activeTurn) : null;
            let isLegalMove = false;
            if (legalMoves) {
                for (const space of legalMoves) {
                    if (space[0] === row && space[1] === column) {
                        isLegalMove = true;
                    }
                }
            }

            //Select a clicked piece matching active player color
            if (clickedPiece 
                && (clickedPiece.color === "white") === this.state.whiteToMove
                && (clickedPiece.color === this.props.playerColor || this.props.singlePlayer)
                && !this.state.tentativeTimeline) {
                this.setState({
                    selectedPiece: clickedPiece
                });
            }

            //move if a piece is selected
            else if (selectedPiece && isLegalMove) {
                const startLocation = selectedPiece.getLocation(boardState)
                const moveParams = {
                    turnNumber: activeTurn,
                    startRow: startLocation[0],
                    startColumn: startLocation[1],
                    endRow: row,
                    endColumn: column,
                    pieceID: selectedPiece.id,
                }
                if (selectedPiece.type === 'king' && Math.abs(startLocation[1]-column) > 1) {
                    moveParams.castle = {
                        row: startLocation[0],
                        startColumn: column===2? 0:7,
                        endColumn: column===2? 3:5,
                        pieceID: timeline.pieces[selectedPiece.color][column===2?0:7].id
                    }
                }
                if (selectedPiece.type === 'pawn' && row === (selectedPiece.color==='white'?7:0)) {
                    const newPieceID = this.state.timeline.pieces.white.length + this.state.timeline.pieces.black.length + 1;
                    const newPieceColor = selectedPiece.color;
                    this.setState({
                        choosingPromotion: {
                            moveParams: moveParams,
                            id: newPieceID,
                            knight: new Knight({id: newPieceID, color: newPieceColor}),
                            rook: new Rook({id: newPieceID, color: newPieceColor}),
                            bishop: new Bishop({id: newPieceID, color: newPieceColor}),
                            queen: new Queen({id: newPieceID, color: newPieceColor}),
                            color: selectedPiece.color,
                        }
                    })
                    return;
                }
                this.executeMove(moveParams)
            }
        }
    }

    updateTimeline(nextTimeline) {//Updates the game state with nextTimeline as the new state
        let firstCheck = nextTimeline.firstCheck();
                if (firstCheck[0]) {
                    this.setState({
                        timeline: nextTimeline,
                        check: true,
                        checkmate: firstCheck[2],
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
                        activeTurn: nextTimeline.boardState.length - 1,
                        whiteToMove: !this.state.whiteToMove,
                        selectedPiece: null,
                    })
                }
    }

    sendMove(moveParams) {
        if(!this.props.singlePlayer) {
            const move = JSON.stringify({move: moveParams})
            this.props.connection.emit('move', move)
        }
    }

    getPiece(id) {
        for (const piece of this.state.timeline.pieces.white){
            if (piece.id === id){
                return piece;
            }
        }
        for (const piece of this.state.timeline.pieces.black){
            if (piece.id === id){
                return piece;
            }
        }
    }
    
    moveIsCheck(turn) {
        if (this.state.whiteToMove && this.state.timeline.blackInCheck[turn]) {
            return true;
        } 
        if (!this.state.whiteToMove && this.state.timeline.whiteInCheck[turn]) {
            return true;
        }
        return false;
    }

    executeMove(moveParams) {
        const timeline = this.state.timeline;
        moveParams.piece = this.getPiece(moveParams.pieceID)
        if (moveParams.castle) {
            moveParams.castle.piece = this.getPiece(moveParams.castle.pieceID)
        }
        if (moveParams.promotion) {
            const props = {id: moveParams.promotion.newPieceID, color: moveParams.promotion.color}
            switch (moveParams.promotion.type) {
                case 'knight':
                    moveParams.promotion.piece = new Knight(props); 
                break;
                case 'rook':
                    moveParams.promotion.piece = new Rook(props);
                break;
                case 'bishop':
                    moveParams.promotion.piece = new Bishop(props);
                break;
                case 'queen':
                    moveParams.promotion.piece = new Queen(props);
                break;
                default:
                break;
            }
            this.state.timeline.pieces[props.color].push(moveParams.promotion.piece);
        }
        const move = new Move(moveParams);
        const nextTimeline = timeline.addMove(move);
        const firstCheck = nextTimeline.firstCheck()
        if (firstCheck[0] !== move.piece.color){
            if(move.piece.color === this.props.playerColor || this.props.singlePlayer) {
                this.setState({
                    tentativeTimeline: nextTimeline,
                    tentativeMove: moveParams,
                    activeTurn: nextTimeline.boardState.length - 1,
                    turnNumber: nextTimeline.boardState.length - 1,
                    selectedPiece: null
                }); 
            }
            else {
                this.updateTimeline(nextTimeline);
                this.setState({
                    lastMoveNumber: move.turnNumber,
                })
            }
        }
        else {
            this.openDialog("This move would leave you in check")
        }
    }

    confirmMove() {
        this.updateTimeline(this.state.tentativeTimeline)
        this.sendMove(this.state.tentativeMove)
        this.setState({
            lastMoveNumber: this.state.tentativeMove.turnNumber,
            tentativeTimeline: undefined,
            tentativeMove: undefined
        })
    }

    rejectMove() {
        const activeTurn = this.state.check?this.state.timeline.firstCheck()[1]:this.state.timeline.boardState.length-1;
        this.setState({
            tentativeTimeline: undefined,
            tentativeMove: undefined,
            activeTurn: activeTurn,
            turnNumber: this.state.timeline.boardState.length - 1,
        })
        this.state.timeline.evaluate();
    }

    choosePromotion(type) {
        const moveParams = this.state.choosingPromotion.moveParams;
        moveParams.promotion = {
            newPieceID: this.state.choosingPromotion.id,
            color: this.state.choosingPromotion.color,
            type: type
        }
        //Add new piece to array of pieces
        this.setState({
            choosingPromotion: undefined,
        })
        this.sendMove(moveParams);
        this.executeMove(moveParams);
    }

    backTurn() {//Decrements active turn by 1
        if (this.state.check && !this.state.checkmate) {
            this.openDialog("You cannot use time travel while in check")
        }
        else {
            let turn = this.state.activeTurn - 1;
            if(!this.state.checkmate){
                while (this.state.timeline.blackInCheck[turn] || this.state.timeline.whiteInCheck[turn]) {
                    turn--;
                }
            }
            if (turn >= 0) {
                this.setState({
                    activeTurn: turn,
                })
            }
        }
    }

    forwardTurn() {//Increments active turn by 1
        if (this.state.check && !this.state.checkmate) {
            this.openDialog("You cannot use time travel while in check")
        }
        else {
            let turn = this.state.activeTurn + 1;
            if(!this.state.checkmate){
                while (this.state.timeline.blackInCheck[turn] || this.state.timeline.whiteInCheck[turn]) {
                    turn++;
                }
            }
            if (turn <= this.state.turnNumber) {
                this.setState({
                    activeTurn: turn,
                })
            }
        }
    }

    goToTurn(turnNumber) {//Jumps the active turn to turnNumber
        if (this.state.check && !this.state.checkmate) {
            this.openDialog("You cannot time travel while in check")
        }
        else {
            let turn = turnNumber + 1;
            if(!this.state.checkmate){
                while (this.state.timeline.blackInCheck[turn] || this.state.timeline.whiteInCheck[turn]) {
                    turn--;
                }
            }
            this.setState({
                activeTurn: turn
            })
        }
    }

    resetGame(verified) {
        if ((this.props.singlePlayer || this.state.reset.opponent) && verified) {
            this.newGame();
            this.props.connection.emit('resetRequest')
        }
        else if (verified) {
            this.setState({
                reset: {
                    self: true
                }
            })
            this.props.connection.emit('resetRequest')
            this.openDialog('Waiting for opponent to accept reset.')
        }
    }

    newGame() {
        const pieces = {
            white: [
                new Rook({id:1,color: "white"}),
                new Knight({id:2,color: "white"}),
                new Bishop({id:3,color: "white"}),
                new Queen({id:4,color: "white"}),
                new King({id:5,color: "white"}),
                new Bishop({id:6,color: "white"}),
                new Knight({id:7,color: "white"}),
                new Rook({id:8,color: "white"}),
                new Pawn({id:9,color: "white"}),
                new Pawn({id:10,color: "white"}),
                new Pawn({id:11,color: "white"}),
                new Pawn({id:12,color: "white"}),
                new Pawn({id:13,color: "white"}),
                new Pawn({id:14,color: "white"}),
                new Pawn({id:15,color: "white"}),
                new Pawn({id:16,color: "white"}),
            ],
            black: [
                new Rook({id:17,color: "black"}),
                new Knight({id:18,color: "black"}),
                new Bishop({id:19,color: "black"}),
                new Queen({id:20,color: "black"}),
                new King({id:21,color: "black"}),
                new Bishop({id:22,color: "black"}),
                new Knight({id:23,color: "black"}),
                new Rook({id:24,color: "black"}),
                new Pawn({id:25,color: "black"}),
                new Pawn({id:26,color: "black"}),
                new Pawn({id:27,color: "black"}),
                new Pawn({id:28,color: "black"}),
                new Pawn({id:29,color: "black"}),
                new Pawn({id:30,color: "black"}),
                new Pawn({id:31,color: "black"}),
                new Pawn({id:32,color: "black"}),
            ]
        };
        this.setState({
            whiteToMove: true,
            check: false,
            checkmate: false,
            turnNumber: 1,
            activeTurn: 1,
            selectedPiece: null,
            tentativeTimeline: undefined,
            tentativeMove: undefined,
            lastMoveNumber: undefined,
            timeline: new Timeline({ // Each property of timeline is an array with index = turn number. ie: timeline.moves[5] is a list of moves made on turn 5
                moves: [],
                pieces: pieces,
            }),
            reset: {
                self: false,
                opponent: false
            }
        });
    }

    openDialog(text, response) {
        const newDialog = <Dialog
            text={text}
            response={response}
            dismiss={() => {
                this.closeDialog()
            }}
        />
        for(const existingDialog of this.state.dialogs) {
            if (existingDialog.props.text === newDialog.props.text) {
                return;
            }
        }
        this.setState({
            dialogs: this.state.dialogs.concat(newDialog)
        })
    }

    closeDialog() {
        this.setState({
            dialogs: this.state.dialogs.slice(1)
        })
    }

    openTutorial() {
        this.openDialog('Use the buttons below the board, or click on any move in the timeline to time travel. Pieces cannot move if they are about to be captured, about to move, or if the move would cause your king to be in check at any point in the timeline.');
    }


    render() {
        const tentative = this.state.tentativeTimeline?true:false
        const timeline = tentative? this.state.tentativeTimeline:this.state.timeline;
        const activeTurn = this.state.activeTurn;
        const moveList = timeline.moves;
        const activeBoardState = timeline.boardState[activeTurn];
        const activePlayer = this.state.whiteToMove ? 'white' : 'black';
        const selectedPiece = this.state.selectedPiece;
        const legalMoves = selectedPiece ? selectedPiece.safeMoves(timeline,activeTurn) : null;
        if (this.state.choosingPromotion) {
            return <div className={"game" + this.props.playerColor}>
                <div>
                    <div className='centered'><Board
                        boardState={activeBoardState}
                        size="medium"
                        onClick={() => null}
                    /></div>
                    Choose a piece to promote your pawn into:<br/>
                    <div className="promotion-option" onClick={() => this.choosePromotion('knight')}>{this.state.choosingPromotion.knight.image}</div>
                    <div className="promotion-option" onClick={() => this.choosePromotion('bishop')}>{this.state.choosingPromotion.bishop.image}</div>
                    <div className="promotion-option" onClick={() => this.choosePromotion('rook')}>{this.state.choosingPromotion.rook.image}</div>
                    <div className="promotion-option" onClick={() => this.choosePromotion('queen')}>{this.state.choosingPromotion.queen.image}</div>
                </div>
            </div>
        }
        return (
            <div onKeyUp={(event) => this.handleKeyPress(event)} className={"game " + (this.props.singlePlayer?activePlayer:this.props.playerColor)}>
                <div className="row-flex-widescreen">
                    <div className="fit-content centered">
                        <Board
                            activePlayer={activePlayer}
                            size="full"
                            boardState={activeBoardState}
                            selectedPiece={selectedPiece}
                            playingBlack={(this.props.playerColor==='black')?true:false}
                            legalMoves={legalMoves}
                            onClick={(row,column) => this.handleClick(row,column)}
                        />
                        {this.renderButtons()}
                    </div>
                    <div className="margin-left-5P-widescreen column-flex">
                        <Movelist
                            activeTurn={activeTurn}
                            activePlayer={activePlayer}
                            allMoves = {moveList}
                            lastMoveNumber = {this.state.lastMoveNumber}
                            tentativeMoveNumber = {tentative ? this.state.tentativeMove.turnNumber : null}
                            onClick={(turn) => this.goToTurn(turn)}
                        />
                        <button onClick={() => this.openDialog('Are you sure you want to reset?', (verified) => this.resetGame(verified))} className="width-full">
                            Reset Game 
                        </button>
                    </div>
                </div>
                {this.state.dialogs[0] ? this.state.dialogs[0] : null}
            </div>
        )
    }

    renderButtons() {
        if (!this.state.tentativeMove){
            return (
                <div className="row-flex">
                    {this.renderTimeTravelButton('back')}
                    <div className="width-50P fully-padded">{
                        this.state.checkmate?
                            "Checkmate!":
                            this.props.singlePlayer?
                                (this.state.whiteToMove?
                                    "White's turn"
                                    : "Black's turn")
                            :((this.props.playerColor === (this.state.whiteToMove?'white':'black'))?
                                'Your turn'
                                :'Waiting')}
                    </div>
                    {this.renderTimeTravelButton('forward')}
                </div>
            )
        }
        else {
            return (
                <div className="row-flex">
                    {this.renderTimeTravelButton('back')}
                    {this.renderConfirmButton()}
                    {this.renderRejectButton()}
                    {this.renderTimeTravelButton('forward')}
                </div>
            )
        }
    }

    renderConfirmButton() {
        const className="width-25P " + (this.state.tentativeTimeline?'': ' disabled');
        return(
            <button className={className} onClick={()=> this.state.tentativeTimeline? this.confirmMove() : null}>Confirm</button>
        )
    }

    renderRejectButton() {
        const className="width-25P " + (this.state.tentativeTimeline?'': ' disabled');
        return(
            <button className={className} onClick={()=> this.state.tentativeTimeline? this.rejectMove() : null}>Undo</button>
        )
    }

    renderTimeTravelButton(direction) {
        const activeTurn = this.state.activeTurn;
        const turnNumber = this.state.turnNumber;
        if (direction === 'forward') {
            const condition = (activeTurn < turnNumber);
            const className = 'forward button width-25P' + (condition?'':' disabled')
            return(
                <button onClick={()=>this.forwardTurn()} className={className}>&raquo;</button>
            )
        }
        if (direction === 'back') {
            const condition = (activeTurn > 0);
            const className = 'back button width-25P' + (condition?'':' disabled')
            return(
                <button onClick={()=>this.backTurn()} className={className}>&laquo;</button>
            )
        }
    }

}

export default Game;