import blackkingimg from './svg/black-king.svg';
import blackknightimg from './svg/black-knight.svg';
import blackqueenimg from './svg/black-queen.svg';
import blackbishopimg from './svg/black-bishop.svg';
import blackrookimg from './svg/black-rook.svg';
import blackpawnimg from './svg/black-pawn.svg';
import whitekingimg from './svg/white-king.svg';
import whiteknightimg from './svg/white-knight.svg';
import whitequeenimg from './svg/white-queen.svg';
import whitebishopimg from './svg/white-bishop.svg';
import whiterookimg from './svg/white-rook.svg';
import whitepawnimg from './svg/white-pawn.svg';


class Piece {
    constructor(props) {
        this.color = props.color;
        this.moved = false;
        this.image = blackkingimg;
    }

    getLocation(boardState) {
        let rowCount = 0;
        for (const row of boardState) {
            let column = 0;
            for (const square of row) {
                if (square === this) {
                    return([rowCount,column]);                    
                }
                column++
            }
            rowCount++
        }
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
        this.abbreviation = 'K';
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
        if (this.color === "black") {
            this.image = blackkingimg;
        }
        else {
            this.image = whitekingimg;
        }
    }
     
    inCheck(boardState) {
        const location = this.getLocation(boardState)
        let rowCount = 0;
        for (const row of boardState) {
            let column = 0;
            for (const piece of row) {
                if (piece && piece.color !== this.color) {
                    for (const move of piece.legalMoves(boardState,rowCount,column)) {
                        if (location[0] === move[0] && location[1] === move[1]) {
                            return true;
                        }
                    }
                }
                column++;
            } 
            rowCount++ 
        }
        return false;
    }
}

export class Queen extends Piece {
    constructor(props){
        super(props);
        this.abbreviation = 'Q';
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
        if (this.color === "black") {
            this.image = blackqueenimg;
        }
        else {
            this.image = whitequeenimg;
        }
    }
}

export class Bishop extends Piece {
    constructor(props){
        super(props);
        this.abbreviation = 'B';
        this.type = "bishop";
        this.moveDirections = [
            [1,1],
            [-1,1],
            [-1,-1],
            [1,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = true;
        if (this.color === "black") {
            this.image = blackbishopimg;
        }
        else {
            this.image = whitebishopimg;
        }
    }
}

export class Rook extends Piece {
    constructor(props){
        super(props);
        this.abbreviation = 'R';
        this.type = "rook";
        this.moveDirections = [
            [1,0],
            [0,1],
            [-1,0],
            [0,-1]
        ]
        this.captureDirections = this.moveDirections;
        this.multistep = true;
        if (this.color === "black") {
            this.image = blackrookimg;
        }
        else {
            this.image = whiterookimg;
        }
    }
}

export class Pawn extends Piece {
    constructor(props){
        super(props);
        this.abbreviation = '';
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
        if (this.color === "black") {
            this.image = blackpawnimg;
        }
        else {
            this.image = whitepawnimg;
        }
    }
    
    legalMoves(boardState, startRow, startColumn) {
        let startSpace = [startRow, startColumn];
        let moves = [];
        for (const direction of this.moveDirections) {
            let space = startSpace;
            space = nextSpace(space, direction);
            if (Math.min(...space) >= 0 && Math.max(...space) <= 7) {
                let occupant = boardState[space[0]][space[1]];
                if ((!occupant)){
                    moves.push(space)
                }
                if (occupant) {
                    break;
                }
            }
            if ((startSpace[0] === 1 && this.color === "white") || (startSpace[0] === 6 && this.color === "black")) {
                space = nextSpace(space, direction);
                let occupant = boardState[space[0]][space[1]];
                if ((!occupant)){
                    moves.push(space)
                }
                if (occupant) {
                    break;
                }
            }
        }
        for (const direction of this.captureDirections) {
            let space = startSpace;
            space = nextSpace(space, direction);
            if (Math.min(...space) >= 0 && Math.max(...space) <= 7) {
                let occupant = boardState[space[0]][space[1]];
                let color = occupant ? occupant.color : null;
                if ((color && color !== this.color)){
                    moves.push(space)
                }
                if (occupant) {
                    break;
                }
            }   
        }
        return moves;
    }
}

export class Knight extends Piece {
    constructor(props){
        super(props);
        this.abbreviation = 'N';
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
        if (this.color === "black") {
            this.image = blackknightimg;
        }
        else {
            this.image = whiteknightimg;
        }
    }
}