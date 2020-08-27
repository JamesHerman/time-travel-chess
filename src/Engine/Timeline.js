class Timeline {
    constructor (props) {
        this.boardState = props.boardState;
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

    snapshot(turn) {
        let snapshot = {
            boardState: this.boardState[turn].map((row) => row.slice()),
            move: this.moves[turn],
            whiteInCheck: this.whiteInCheck[turn],
            blackInCheck: this.blackInCheck[turn]
        }
        return snapshot;
    }

    firstCheck() { //Identifies first player in unresolved check in the timeline, and the turn on which they must move out of check. 
        const finalTurn = this.whiteInCheck.length - 1;
        for (let turn = 0; turn <= finalTurn; turn++) {
            if (this.whiteInCheck[turn] && this.blackInCheck[turn]) {
                return [this.move[turn].piece.color ? 'black' : 'white', turn - 1];
            }
            else if (this.blackInCheck[turn] && turn === finalTurn) {
                return ['black', turn]
            }
            else if (this.whiteInCheck[turn] && turn === finalTurn) {
                return ['white', turn]
            }
            else if (this.whiteInCheck[turn] && this.whiteInCheck[turn + 1]) {
                return ['white', turn - 1];
            }
            else if (this.blackInCheck[turn] && this.whiteInCheck[turn + 1]) {
                return ['black', turn - 1];
            }
        }
        return [null, null];
    }

    addMove(move) { //Returns a new timeline resulting from a move being added, or null if the move would cause the player to be in check
        const turnNumber = move.turnNumber
        const activePlayer = move.piece.color;
        const nextTimeline = new Timeline({
            boardState: this.boardState.slice(),
            moves: this.moves.slice(),
            whiteInCheck: this.whiteInCheck.slice(),
            blackInCheck: this.blackInCheck.slice(),
        });
        nextTimeline.moves.splice(turnNumber, 0, move);
        nextTimeline.evaluate();
        return (nextTimeline.firstCheck()[0] === activePlayer) ? null : nextTimeline;  
    }

    evaluate() { //Reevalutes the board states of a timeline after a move has been added
        const finalMove = this.moves.length - 1;
        for (let turn = 0; turn <= finalMove; turn++) {
            let next = this.moves[turn] ? this.boardAfter(turn) : {
                boardState: this.boardState[turn], 
                whiteInCheck: this.whiteInCheck[turn], 
                blackInCheck:this.blackInCheck[turn]
            }
            this.boardState[turn + 1] = next.boardState;
            this.whiteInCheck[turn + 1] = next.whiteInCheck;
            this.blackInCheck[turn + 1] = next.blackInCheck;
        }
    }

    boardAfter(turn) { //Executes the move for turn, returning the board state after the moves are complete, and whether either player is in check.
        const snapshot = this.snapshot(turn);
        const board = snapshot.boardState.map((row) => row.slice());
        const whiteKing = this.whiteKing;
        const blackKing = this.blackKing;
        const move =  snapshot.move;
        const color = move.piece.color;
        let nextBoard = move.valid(board, whiteKing, blackKing)
        if (nextBoard) {
            move.check = false;
            if ((nextBoard.whiteInCheck && color === "black") || (nextBoard.blackInCheck && color === "white")) {
                move.check = true;
            }
        } else {nextBoard = snapshot}
        return {
            boardState: nextBoard.boardState,
            whiteInCheck: nextBoard.whiteInCheck,
            blackInCheck: nextBoard.blackInCheck
        }
    }
}

export default Timeline