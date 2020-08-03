class Piece {
    constructor(props) {
        this.color = props.color;
        this.moved = false;
    }

    //Returns array of coordinates for legal moves
    legalMoves(boardState, startRow, startColumn) {
        let startSpace = [startRow, startColumn];
        let moves = [];
        for (const direction of this.moveDirections) {
            let space = startSpace;
            do {
                space = nextSpace(space, direction);
                if (Math.min(...space) >= 0 && Math.max(...space) <= 7) {
                    let occupant = boardState[space[0]][space[1]];
                    let color = occupant ? occupant.color : null;
                    if ((!occupant || color !== this.color)){
                        moves.push(space)
                    }
                    if (occupant) {
                        break;
                    }
                } else break;
            } while (this.multistep)
        }
        return moves;
    }
}

function nextSpace(currentSpace, direction) {
    return [currentSpace[0] + direction[0], currentSpace[1] + direction[1]]
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