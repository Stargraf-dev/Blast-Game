import { Tile, TileColor} from './Tile';

export interface IBoard {
    rows: number;
    cols: number;
    quantityColor: number;
    board: (number)[][];
}

interface Ipoint {
    rows: number;
    cols: number;
}

export interface Idroplist {
    xdl: number;
    yFrom: number;
    yTo: number;
}

export class Board implements IBoard {
    public rows: number = 8;
    public cols: number = 8;
    public quantityColor: number = 5;
    public board: (number)[][] = [];
    private copyboard: (number)[][] = [];

    constructor(heightBoard: number, widthBoard: number) {
        this.rows = heightBoard;
        this.cols = widthBoard;
    }

    public createBoard(): void {
        for (let y = 0; y < this.rows; y++) {
            this.board[y] = [];
            this.copyboard[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = Math.floor(Math.random() * this.quantityColor) + 1;
                this.copyboard[y][x] = this.board[y][x];
            }
        }
    }

    public tryDestroy(tile: Tile, bomb: boolean) {

        let point: Ipoint = { rows: tile.y, cols: tile.x }
        let points: Ipoint[] = []
        points.push(point);
        let lenghtpoints: number = points.length;
        //copy 2mer array
        this.copyboard = this.board.map(row => row.slice());
        if (!bomb) {
            points = this.searchThisColorTiles(points, tile.color + 1);

            if (points.length > lenghtpoints) {
                //zeroing tiles color
                this.board = this.copyboard.map(row => row.slice())
                this.copyboard = undefined;
            }
            else {
                this.copyboard = undefined;
            }

        }
        else {
  
            points = this.searchBombRadius(tile, 2);
            this.board = this.copyboard.map(row => row.slice())
            this.copyboard = undefined;
        }

        this.printBoard();
    }

    private searchBombRadius(tile: Tile, radius: number): Ipoint[] {
        let result: Ipoint[] = [];

        const centerX = tile.x;
        const centerY = tile.y;

        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                    const distance = Math.sqrt(
                        Math.pow(x - centerX, 2) +
                        Math.pow(y - centerY, 2)
                    );
                    if (distance <= radius) {
                        result.push({ rows: y, cols: x });
                    }
                }
            }
        }

        // zeroing all tiles
        for (const point of result) {
            this.copyboard[point.rows][point.cols] = 0;
        }

        return result;
    }

    private searchThisColorTiles(list: Ipoint[], color: number): Ipoint[] 
    {
        let lengthlist: number = list.length;
        // colors for tiles from list do 0
        for (const point of list) {
            this.copyboard[point.rows][point.cols] = 0;
        }


        for (const i of list) {
            // up tile
            if ((i.rows - 1) >= 0 && this.copyboard[i.rows - 1][i.cols] === color) {
                this.copyboard[i.rows - 1][i.cols] = 0;
                console.log('Write this point in list in cikl UP position')
                console.log(i.rows - 1, i.cols);
                list.push({ rows: i.rows - 1, cols: i.cols });
            }
            // down tile
            if (i.rows + 1 < this.rows && this.copyboard[i.rows + 1][i.cols] === color) {
                this.copyboard[i.rows + 1][i.cols] = 0;
                console.log('Write this point in list in cikl down position')
                console.log(i.rows + 1, i.cols);
                list.push({ rows: i.rows + 1, cols: i.cols });
            }
            // left tile
            if (i.cols - 1 >= 0 && this.copyboard[i.rows][i.cols - 1] === color) {
                this.copyboard[i.rows][i.cols - 1] = 0;
                console.log('Write this point in list in cikl left position')
                console.log(i.rows, i.cols - 1);
                list.push({ rows: i.rows, cols: i.cols - 1 });
            //right tile
            }
            if (i.cols + 1 < this.cols && this.copyboard[i.rows][i.cols + 1] === color) {
                this.copyboard[i.rows][i.cols + 1] = 0;
                console.log('Write this point in list in cikl right position')
                console.log(i.rows, i.cols + 1);
                list.push({ rows: i.rows, cols: i.cols + 1 });
            }
        }


        if (list.length > lengthlist) {
            return this.searchThisColorTiles(list, color);
        }
        else {
            return list;
        }

    }


    public dropTiles(): Idroplist[] {
        let droplist: Idroplist[] = [];
        // from down to up
        for (let x = 0; x < this.cols; x++) {
            let writeRow = this.rows - 1; 

            for (let y = this.rows - 1; y >= 0; y--) {
                if (this.board[y][x] !== 0) {
                    if (y !== writeRow) {
                        droplist.push({ xdl: x, yFrom: y,yTo: writeRow});
                        this.board[writeRow][x] = this.board[y][x];
                        this.board[y][x] = 0;
                    }
                    writeRow--;
                }
            }
        }
        return droplist;
    }
    public printBoard(): void {
        console.log("=== Board ===");
        for (let y = 0; y < this.rows; y++) {
            let rowStr = "";
            for (let x = 0; x < this.cols; x++) {
                rowStr += this.board[y][x] + " ";
            }
            console.log(rowStr);
        }
    }

    public addAfterDrop() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x] === 0) {
                    this.board[y][x] = Math.floor(Math.random() * this.quantityColor) + 1;
                }
            }
        }
    }

    public getColorTile(x: number, y: number): TileColor {
        let color: TileColor = this.board[x][y];
        return color;
    }
}
