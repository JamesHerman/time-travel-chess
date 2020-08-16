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
        this.notation = function() {
            let columns = ['a','b','c','d','e','f','g','h']
            if (this.capture) {
                return this.piece.abbreviation + columns[this.startColumn] + (this.startRow+1) + 'x' + columns[this.endColumn] + (this.endRow + 1)
            }
            else {
                return this.piece.abbreviation + columns[this.startColumn] + (this.startRow+1) + columns[this.endColumn] + (this.endRow + 1)
            }
        } 
    }

    valid(boardState, nextTurnBoardState) {
        //Check if piece is recorded as moved this turn
        if (this.piece.moved) {
            this.invalid = true;
            return false;
        }
        //Check if piece is in correct starting position
        if (!(boardState[this.startRow][this.startColumn] === this.piece)) {
            this.invalid = true;
            return false;
        }
        //Check if end square is valid
        this.capture = false;
        let endSquare = nextTurnBoardState[this.endRow][this.endColumn] //Null if square is empty
        if (endSquare) {
            //Cannot move onto own color
            if (endSquare.color === this.piece.color) {
                this.invalid = true;
                return false;
            }
            //Account for pawn having different capture directions to move directions
            if (this.piece.type === "pawn") {
                for (const direction of this.piece.moveDirections) {
                    if (this.vector === direction) {
                        this.invalid = true;
                        return false
                    }
                }
            }
            this.capture = true;
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
        //Move is assumed to be valid by default
        this.invalid = false;
        return true;
    }

    executeTurnMoves(snapshot) {

    }
    
    
}