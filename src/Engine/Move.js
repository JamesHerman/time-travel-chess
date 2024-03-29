export default class Move {
    /*Props
    startRow 
    startColumn - coordinates for the start of move
    endRow
    endColumn - coordinates for the end of move
    piece - piece that is moving
    */
    constructor(props) {
        this.turnNumber = props.turnNumber
        this.startRow = props.startRow;
        this.startColumn = props.startColumn;
        this.endRow = props.endRow;
        this.endColumn = props.endColumn;
        this.piece = props.piece;
        this.vector = [this.endRow - this.startRow, this.endColumn - this.startColumn]
        this.invalid = false;
        this.capture = false;
        this.check = false;
        this.castle = props.castle;
        this.promotion = props.promotion;
        this.notation = function() {
            let columns = ['a','b','c','d','e','f','g','h']
            let notation = this.piece.abbreviation + columns[this.startColumn] + (this.startRow+1) + columns[this.endColumn] + (this.endRow + 1);
            if (this.capture) {
                notation = this.piece.abbreviation + columns[this.startColumn] + (this.startRow+1) + 'x' + columns[this.endColumn] + (this.endRow + 1)
            }
            if (this.castle) {
                notation = this.endColumn === 6 ? 'O-O' : 'O-O-O'
            }
            if (this.promotion) {
                notation = notation + props.promotion.piece.abbreviation;
            }
            if (this.check) {
                notation = notation + "+"
            }
            return notation;
        } 
    }

    valid(boardState, whiteKing, blackKing) {
        //Check if piece is in correct starting position and has not already moved
        if (!(boardState[this.startRow][this.startColumn] === this.piece)) {
            this.invalid = true;
            return false;
        }
        //Check if end square is valid
        this.capture = false;
        let endSquare = boardState[this.endRow][this.endColumn] //Null if square is empty
        if (endSquare) {
            //Cannot capture own color
            if (endSquare.color === this.piece.color) {
                this.invalid = true;
                return false;
            }
            //Account for pawn having different capture directions to move directions
            if (this.piece.type === "pawn") {
                for (const direction of this.piece.moveDirections) {
                    if ((this.vector[0] === direction[0] || this.vector[0] === direction[0] * 2) && this.vector[1] === direction[1]) {
                        this.invalid = true;
                        return false;
                    }
                }
            }
            this.capture = true;
        }
        if (this.piece.type === "pawn" && !endSquare) {
            for (const direction of this.piece.captureDirections) {
                if (this.vector[0] === direction[0] && this.vector[1] === direction[1]) {
                    this.invalid = true;
                    return false;
                }
            }
            //Pawns can't jump
            if ((this.vector[0] === 2 && boardState[this.endRow - 1][this.endColumn]) || (this.vector[0] === -2 && boardState[this.endRow + 1][this.endColumn])) {
                this.invalid = true;
                return false;
            }
        }
        //For pieces that multistep (Bishop, Rook & Queen), check that path to end square is clear
        if (this.piece.multistep) {
            let stepRow = this.vector[0] ? this.vector[0]/Math.abs(this.vector[0]) : 0; //+1, -1, or 0
            let stepColumn = this.vector[1] ? this.vector[1]/Math.abs(this.vector[1]) : 0; //+1, -1, or 0
            let checkRow = this.startRow + stepRow;
            let checkColumn = this.startColumn + stepColumn;
            let checkSquare = boardState[checkRow][checkColumn];
            while (!(checkRow === this.endRow && checkColumn === this.endColumn)) {
                if (checkSquare) {
                    this.invalid = true;
                    return false;
                }
                checkRow += stepRow;
                checkColumn += stepColumn;
                checkSquare = boardState[checkRow][checkColumn];
            } 
        }
        

        //Create next board state and check for check
        const nextBoard = boardState.map((row) => row.slice());
        nextBoard[this.startRow][this.startColumn] = null;
        nextBoard[this.endRow][this.endColumn] = this.piece;
        if (this.castle) {
            nextBoard[this.castle.row][this.castle.startColumn] = null;
            nextBoard[this.castle.row][this.castle.endColumn] = this.castle.piece;
        }
        if (this.promotion) {
            nextBoard[this.endRow][this.endColumn] = this.promotion.piece;
        }

        const whiteInCheck = whiteKing.inCheck(nextBoard);
        const blackInCheck = blackKing.inCheck(nextBoard);
        
        if ((this.piece.color === "white" && whiteInCheck)||(this.piece.color === "black" && (blackInCheck))) {
            this.invalid = true;
            return false;
        }
        //Move is assumed to be valid by default
        this.invalid = false;
        return {
            boardState:nextBoard, 
            whiteInCheck:whiteInCheck,
            blackInCheck:blackInCheck 
        };
    }
}