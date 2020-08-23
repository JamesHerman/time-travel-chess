class Timeline {
    constructor (props) {
        this.boardState = props.boardState;
        this.whiteToMove = props.whiteToMove;
        this.moves = props.moves;
        this.whiteInCheck = props.whiteInCheck;
        this.blackInCheck = props.blackInCheck;
        for (const row of this.boardState[0]) {
            for (const piece of row) {
                if (piece && piece.type === 'king' && piece.color === 'black') {
                    this.blackKing = piece;                    
                }
                if (piece && piece.type === 'king' && piece.color === 'white') {
                    this.whiteKing = piece;
                }
            }
        }
    }

    copy() {
        return
    }

    snapshot(turn) {
        let snapshot = {
            boardState: this.boardState[turn].map((row) => row.slice()),
            whiteToMove: this.whiteToMove[turn],
            moves: this.moves[turn].slice(),
            whiteInCheck: this.whiteInCheck[turn],
            blackInCheck: this.blackInCheck[turn]
        }
        return snapshot;
    }

    firstCheck() { //Identifies first player in unresolved check in the timeline, and the turn on which they must move out of check. 
        const finalTurn = this.whiteInCheck.length - 1;
        for (let turn = 0; turn <= finalTurn; turn++) {
            if (this.whiteInCheck[turn] && this.blackInCheck[turn]) {
                return [this.whiteToMove[turn] ? 'black' : 'white', turn - 1];
            }
            else if (this.whiteInCheck[turn] && !this.whiteToMove[turn]) {
                return ['white', turn - 1];
            }
            else if (this.blackInCheck[turn] && this.whiteToMove[turn]) {
                return ['black', turn - 1];
            }
            else if (this.blackInCheck[turn] && turn === finalTurn) {
                return ['black', turn]
            }
            else if (this.whiteInCheck[turn] && turn === finalTurn) {
                return ['white', turn]
            }
        }
        return [null, null];
    }

    addMove(move) { //Returns a new timeline resulting from a move being added, or null if the move would cause the player to be in check
        const turnNumber = move.turnNumber
        const activePlayer = this.snapshot(turnNumber).whiteToMove ? 'white' : 'black';
        const nextTimeline = new Timeline({
            boardState: this.boardState.slice(),
            moves: this.moves.slice(),
            whiteToMove: this.whiteToMove.slice(),
            whiteInCheck: this.whiteInCheck.slice(),
            blackInCheck: this.blackInCheck.slice(),
        });
        nextTimeline.moves[turnNumber] = nextTimeline.moves[turnNumber].concat(move);
        nextTimeline.evaluate()
        return (nextTimeline.firstCheck()[0] === activePlayer) ? null : nextTimeline;  
    }

    evaluate() { //Reevalutes the board states of a timeline after a move has been added
        const finalTurn = this.boardState.length - 1;
        for (let turn = 0; turn < finalTurn; turn++) {
            let next = this.boardAfter(turn);
            this.boardState[turn + 1] = next.boardState;
            this.whiteInCheck[turn + 1] = next.whiteInCheck;
            this.blackInCheck[turn + 1] = next.blackInCheck;
        }
        if (this.moves[finalTurn - 1][0] || this.moves[finalTurn][0]) {
            let next = this.boardAfter(finalTurn);
            this.boardState[finalTurn + 1] = next.boardState;
            this.whiteInCheck[finalTurn + 1] = next.whiteInCheck;
            this.blackInCheck[finalTurn + 1] = next.blackInCheck;
            this.whiteToMove[finalTurn + 1] = finalTurn % 2 === 0;
            this.moves[finalTurn + 1] = [];
        }
    }

    boardAfter(turn) { //Executes the moves for turn, returning the board state after the moves are complete, and whether either player is in check.
        const snapshot = this.snapshot(turn);
        const board = snapshot.boardState.map((row) => row.slice());
        const whiteKing = this.whiteKing;
        const blackKing = this.blackKing;
        let nextBoard = board.map((row) => row.slice());
        let whiteInCheck = snapshot.whiteInCheck;
        let blackInCheck = snapshot.blackInCheck;
        for (const move of snapshot.moves) {
            if (move.valid(board,nextBoard)) {
                let capturedPiece = nextBoard[move.endRow][move.endColumn];
                nextBoard[move.startRow][move.startColumn] = null;
                nextBoard[move.endRow][move.endColumn] = move.piece;
                whiteInCheck = whiteKing.inCheck(nextBoard);
                blackInCheck = blackKing.inCheck(nextBoard);
                move.check = false;
                if ((snapshot.whiteToMove && (whiteInCheck && !snapshot.whiteInCheck))||(!snapshot.whiteToMove && (blackInCheck && !snapshot.blackInCheck))) {
                    move.invalid = true;
                    nextBoard[move.startRow][move.startColumn] = move.piece;
                    nextBoard[move.endRow][move.endColumn] = capturedPiece;
                }
                else if ((whiteInCheck && !snapshot.whiteToMove)|| (blackInCheck && snapshot.whiteToMove)) {
                    move.check = true;
                }
            }
        }
        return {
            boardState: nextBoard,
            whiteInCheck: whiteInCheck,
            blackInCheck: blackInCheck
        }
    }
}

export default Timeline