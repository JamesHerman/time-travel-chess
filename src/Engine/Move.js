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
    }
}