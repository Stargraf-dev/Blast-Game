// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Board } from './Board';
import { Tile, TileColor } from './Tile';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    board: Board;
    tile: Tile;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        console.log("hi guys");
        this.board = new Board(4, 4);
        this.tile = new Tile(1, 2, 1);

        console.log(this.board.rows);
        console.log(this.board.cols);
        //this.test.createBoard();
        this.board.printBoard();
        this.board.tryDestroy(this.tile);
        this.board.printBoard();
        this.board.dropTiles();
        this.board.printBoard();
        this.board.addAfterDrop();
        this.board.printBoard();

        //this.test.dropTiles();
        //this.test.printBoard();
        

        

    }

    // update (dt) {}
}
