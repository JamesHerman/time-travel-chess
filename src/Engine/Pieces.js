class Piece {
    constructor(props) {
        this.row = props.row
        this.column = props.column
        this.color = props.color
    }
}

class Knight extends Piece {
    moveTo(row,column) {
        isLegalMove = false
        legalMoves = [
            [this.row + 2, this.column + 1],
            [this.row + 2, this.column - 1],
            [this.row + 1, this.column + 2],
            ]
    }
}

function squareIsOnBoard(row,column) {
    if ((row <= 7 || row >= 0) && (column <= 0 || column >= 7)) {}

}