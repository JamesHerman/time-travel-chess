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

    firstCheck() {
        const lastTurn = this.whiteInCheck.length - 1;
        for (let turn = 0; turn <= lastTurn; turn++) {
            if (this.whiteInCheck[turn] && this.blackInCheck[turn]) {
                return [this.whiteToMove[turn] ? 'black' : 'white', turn - 1];
            }
            else if (this.whiteInCheck[turn] && !this.whiteToMove[turn]) {
                return ['white', turn - 1];
            }
            else if (this.blackInCheck[turn] && this.whiteToMove[turn]) {
                return ['black', turn - 1];
            }
            else if (this.blackInCheck[turn] && turn === lastTurn) {
                return ['black', turn]
            }
            else if (this.whiteInCheck[turn] && turn === lastTurn) {
                return ['white', turn]
            }
        }
        return [null, null];
    }

    addMove(move) {
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

    evaluate() {
        const lastTurn = this.boardState.length - 1;
        for (let turn = 0; turn < lastTurn; turn++) {
            let next = this.boardAfter(turn);
            this.boardState[turn + 1] = next.boardState;
            this.whiteInCheck[turn + 1] = next.whiteInCheck;
            this.blackInCheck[turn + 1] = next.blackInCheck;
        }
        if (this.moves[lastTurn - 1][0] || this.moves[lastTurn][0]) {
            let next = this.boardAfter(lastTurn);
            this.boardState[lastTurn + 1] = next.boardState;
            this.whiteInCheck[lastTurn + 1] = next.whiteInCheck;
            this.blackInCheck[lastTurn + 1] = next.blackInCheck;
            this.whiteToMove[lastTurn + 1] = lastTurn % 2 === 0;
            this.moves[lastTurn + 1] = [];
        }
    }

    boardAfter(turn) {
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
                if ((snapshot.whiteToMove && (whiteInCheck && !snapshot.whiteInCheck))||(!snapshot.whiteToMove && (blackInCheck && !snapshot.blackInCheck))) {
                    move.invalid = true;
                    nextBoard[move.startRow][move.startColumn] = move.piece;
                    nextBoard[move.endRow][move.endColumn] = capturedPiece;
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