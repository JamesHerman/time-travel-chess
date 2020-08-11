export default class Move {
    /*Props
    startRow 
    startColumn - coordinates for the start of move
    endRow
    endColumn - coordinates for the end of move
    piece - piece that is moving
    */
    constructor(props) {
        this.startRow = props.startRow;
        this.startColumn = props.startColumn;
        this.endRow = props.endRow;
        this.endColumn = props.endColumn;
        this.piece = props.piece;
        this.vector = [this.endRow - this.startRow, this.endColumn - this.startColumn]
    }

    valid(boardState, nextTurnBoardState) {
        //Check if piece is recorded as moved this turn
        if (this.piece.moved) {
            return false;
        }
        //Check if piece is in correct starting position
        if (!(boardState[this.startRow][this.startColumn] === this.piece)) {
            return false;
        }
        //Check if end square is valid
        let endSquare = nextTurnBoardState[this.endRow][this.endColumn] //Null if square is empty
        if (endSquare) {
            //Cannot move onto own color
            if (endSquare.color === this.piece.color) {
                return false;
            }
            //Account for pawn having different capture directions to move directions
            if (this.piece.type === "pawn") {
                for (const direction of this.piece.captureDirections) {
                    if (this.vector === direction) {
                        return false
                    }
                }
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
                    return false;
                }
                checkRow += stepRow;
                checkColumn += stepColumn;
                checkSquare = boardState[checkRow][checkColumn];
            } 
        }
        //Move is assumed to be valid by default
        return true;
    }
}