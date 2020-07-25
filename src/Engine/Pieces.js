class Piece {
    constructor(props) {
        this.row = props.row;
        this.column = props.column;
        this.color = props.color;
    }

    movedTo(row,column) {
        this.row = row;
        this.column = column;
    }
}

export class King extends Piece {
    constructor(props){
        super(props);
        this.type = "king";
        this.moveDirections = [
            [1,0],
            [1,1],
            [0,1],
            [-1,1],
            [-1,0],
            [-1,-1],
            [0,-1],
            [1,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = false;
    }
}

export class Queen extends Piece {
    constructor(props){
        super(props);
        this.type = "queen";
        this.moveDirections = [
            [1,0],
            [1,1],
            [0,1],
            [-1,1],
            [-1,0],
            [-1,-1],
            [0,-1],
            [1,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = true;
    }
}

export class Bishop extends Piece {
    constructor(props){
        super(props);
        this.type = "bishop";
        this.moveDirections = [
            [1,1],
            [-1,1],
            [-1,-1],
            [1,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = true;
    }
}

export class Rook extends Piece {
    constructor(props){
        super(props);
        this.type = "rook";
        this.moveDirections = [
            [1,0],
            [0,1],
            [-1,0],
            [0,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = true;
    }
}

export class Pawn extends Piece {
    constructor(props){
        super(props);
        this.type = "pawn";
        if (this.color === "black") {
            this.moveDirections = [
                [-1,0]
            ]
            this.captureDirections = [
                [-1,1],
                [-1,-1]
            ]
        }
        if (this.color === "white") {
            this.moveDirections = [
                [1,0]
            ]
            this.captureDirections = [
                [1,1],
                [1,-1]
            ]
        }
        this.multistep = false;
    }
}

export class Knight extends Piece {
    constructor(props){
        super(props);
        this.type = "knight";
        this.moveDirections = [
            [1,2],
            [1,-2],
            [-1,2],
            [-1,-2],
            [2,1],
            [2,-1],
            [-2,1],
            [-2,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = false;
    }
}