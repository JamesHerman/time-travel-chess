class Timeline {
    constructor (props) {
        this.boardState = props.boardState;
        this.whiteToMove = props.whiteToMove;
        this.moves = props.moves;
        this.whiteInCheck = props.whiteInCheck;
        this.blackInCheck = props.blackInCheck;
    }

    snapshot(turn) {
        let snapshot = {
            boardState: this.boardState[turn],
            whiteToMove: this.whiteToMove,
            moves: this.moves,
            whiteInCheck: this.whiteInCheck,
            blackInCheck: this.blackInCheck
        }
        return snapshot;
    }

    firstCheck() {
        for (let turn = 0; turn < this.whiteInCheck.length; turn++) {
            if (this.whiteInCheck[turn] && this.blackInCheck[turn]) {
                return [this.whiteToMove[turn] ? 'black' : 'white', turn - 1];
            }
            else if (this.whiteInCheck[turn] && !this.whiteToMove[turn]) {
                return ['white', turn - 1];
            }
            else if (this.blackInCheck[turn] && this.whiteToMove[turn]) {
                return ['black', turn - 1];
            }
        }
        return [null, null];
    }

    timelineAfterMove(startTurn,move,whitePieces,blackPieces) {        
        const blackKing = blackPieces[4];
        const whiteKing = whitePieces[4];
        const boardStates = this.boardState.slice();
        const blackInCheck = this.blackInCheck.slice();
        const whiteInCheck = this.whiteInCheck.slice();
        const whiteToMove = this.whiteToMove.slice();
        const moves = this.moves.slice();
        const tempTimeline = new Timeline({
            boardState: boardStates,
            moves: moves,
            whiteToMove: whiteToMove,
            whiteInCheck: whiteInCheck,
            blackInCheck: blackInCheck,
        })
        tempTimeline.moves[startTurn] = tempTimeline.moves[startTurn].concat(move);

        for (let turn = startTurn; turn <= move.turnNumber; turn++) {
            let boardBefore = boardStates[turn].map((row) => row.slice());
            let boardAfter = boardBefore.map((row) => row.slice());
            whitePieces.forEach(function(piece) {
                piece.moved = false;
            })
            blackPieces.forEach(function(piece) {
                piece.moved = false;
            })
            for (const move of moves[turn]) {
                if (move.valid(boardBefore,boardAfter)) {
                    let capturedPiece = boardAfter[move.endRow][move.endColumn];
                    boardAfter[move.startRow][move.startColumn] = null;
                    boardAfter[move.endRow][move.endColumn] = move.piece;
                    if ((whiteToMove[turn] && (!whiteKing.inCheck(boardAfter) || whiteKing.inCheck(boardBefore)))||(!whiteToMove[turn] && (!blackKing.inCheck(boardAfter) || blackKing.inCheck(boardBefore)))) {
                        move.piece.moved = true;
                    }
                    else {
                        move.invalid = true;
                        boardAfter[move.startRow][move.startColumn] = move.piece;
                        boardAfter[move.endRow][move.endColumn] = capturedPiece;
                    }
                }
            }
            
            //Update
            if (turn < move.turnNumber || moves[turn][0] || moves[turn-1][0]) {
                boardStates[turn + 1] = boardAfter;
                whiteToMove[turn + 1] = turn % 2 === 0;
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
}

export default Timeline