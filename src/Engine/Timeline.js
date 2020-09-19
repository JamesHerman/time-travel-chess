class Timeline {
    constructor (props) {
        this.pieces = props.pieces;
        this.boardState = [[
            this.pieces.white.slice(0,8),
            this.pieces.white.slice(8,16),
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            this.pieces.black.slice(8,16),
            this.pieces.black.slice(0,8)],
            [this.pieces.white.slice(0,8),
            this.pieces.white.slice(8,16),
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            this.pieces.black.slice(8,16),
            this.pieces.black.slice(0,8)],];
        this.moves = props.moves;
        this.whiteInCheck = [false,false];
        this.blackInCheck = [false,false];
        this.blackKing = props.pieces.black[4];
        this.whiteKing = props.pieces.white[4];
        this.evaluate()
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

    firstCheck() { //Identifies first player in unresolved check in the timeline, turn on which they are in check, and whether it is checkmate. 
        const finalTurn = this.whiteInCheck.length - 1;
        let color = null;
        let checkTurn = null;
        for (let turn = 0; turn <= finalTurn; turn++) {
            if (this.whiteInCheck[turn] && this.blackInCheck[turn]) {
                color = this.move[turn].piece.color ? 'black' : 'white'
                checkTurn = turn - 1;
                break;
            }
            else if (this.blackInCheck[turn] && turn === finalTurn) {
                color = 'black';
                checkTurn = turn;
                break;
            }
            else if (this.whiteInCheck[turn] && turn === finalTurn) {
                color = 'white'
                checkTurn = turn;
                break;
            }
            else if (this.whiteInCheck[turn] && this.whiteInCheck[turn + 1]) {
                color = 'white'
                checkTurn = turn - 1;
                break;
            }
            else if (this.blackInCheck[turn] && this.whiteInCheck[turn + 1]) {
                color = 'black';
                checkTurn = turn - 1;
                break;
            }
        }
        let checkmate = false;
        if (color) {
            checkmate = true;
            if (color === "white") {
                for (const piece of this.pieces.white) {
                    if (piece.safeMoves(this,checkTurn)[0]) {
                        checkmate = false;
                    }
                }
            } 
            else {
                for (const piece of this.pieces.black) {
                    if (piece.safeMoves(this,checkTurn)[0]) {
                        checkmate = false;
                    }
                }
            }
        }
        return [color, checkTurn, checkmate];
    }

    //Return whether the last move on which the player can castle [kingside, queenside]
    castleInvalidAfterTurn(color) {
        const finalTurn = this.moves.length - 1;
        let queensideRook = this.pieces[color][0]
        let kingsideRook = this.pieces[color][7]
        let king = this.pieces[color][4]
        let checkArray = color === 'white' ? this.whiteInCheck: this.blackInCheck;
        let lastTurn = {queenside: finalTurn + 1, kingside: finalTurn + 1}
        for(let turn = 0;turn <= finalTurn; turn++) {
            let move = this.moves[turn];
            if (move.piece === king || checkArray[turn]) {
                lastTurn.queenside = Math.min(lastTurn.queenside, turn)
                lastTurn.kingside = Math.min(lastTurn.kingside, turn)
            }
            if (move.piece === queensideRook) {
                lastTurn.queenside = Math.min(lastTurn.queenside, turn)
            }
            if (move.piece === kingsideRook) {
                lastTurn.kingside = Math.min(lastTurn.kingside, turn)
            }
        }
        return lastTurn;
    }

    addMove(move) { //Returns a new timeline resulting from a move being added, or null if the move would cause the player to be in check
        const turnNumber = move.turnNumber
        const nextTimeline = new Timeline({
            pieces: this.pieces,
            moves: this.moves.slice(),
        });
        nextTimeline.moves.splice(turnNumber, 0, move);
        nextTimeline.evaluate();
        return nextTimeline;  
    }

    evaluate() { //Reevalutes the board states of a timeline after a move has been added
        const finalMove = this.moves.length - 1;
        for (let turn = 0; turn <= finalMove; turn++) {
            let next = this.moves[turn] ? this.boardAfter(turn) : {
                boardState: this.boardState[turn], 
                whiteInCheck: this.whiteInCheck[turn], 
                blackInCheck: this.blackInCheck[turn]
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