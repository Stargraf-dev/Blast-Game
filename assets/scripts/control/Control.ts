import { Board,Idroplist } from '../core/Board';
import { Tile, TileColor } from '../core/Tile';
import { GamePlay } from '../core/GamePlay';
import BoardView from '../view/BoardView';



const { ccclass, property } = cc._decorator;

@ccclass
export default class Control extends cc.Component {

    @property(BoardView)
    public boardView: BoardView = null;

    @property(cc.Label)
    public movesText: cc.Label = null;

    @property(cc.Label)
    public pointsText: cc.Label = null;

    @property(cc.Label)
    public bombText: cc.Label = null;

    @property(cc.Label)
    public winLoseText: cc.Label = null;

    @property
    //gameplay
    public moves: number = 5;
    public scoreTarget: number = 1000;
    public pointsCurrent: number = 0;
    public scoreForTile: number = 20;

    public coreboard: Board;
    public droplist: Idroplist[] = [];
    public gamePlay: GamePlay;
    public bomb: boolean = false;
    public bombQantity: number = 3;

    start() {
        //Create objects
        this.gamePlay = new GamePlay(this.scoreTarget, this.moves, this.scoreForTile)
        this.coreboard = new Board(8, 8);
        this.coreboard.createBoard();
        this.coreboard.printBoard();

        //Subscribe on listening
        this.Subscribe();
        this.UpdateBoard();

        //Connect gameplay text
        this.UpdateGameplay();
        this.winLoseText.string = '';

    }

    UpdateGameplay() {
        this.pointsText.string = this.gamePlay.currentScore.toString() + "/"
            + this.gamePlay.targetScore.toString();
        this.movesText.string = this.gamePlay.moves.toString();
        this.bombText.string = this.bombQantity.toString();

        if (this.gamePlay.isVictory && this.moves > 0) {
            this.winLoseText.string = "\u041F\u043E\u0431\u0435\u0434\u0430!!!";
            this.Unsubscribe();
        }
        else if (this.gamePlay.isGameOver) {
            this.winLoseText.string = "\u0412\u044B \u043F\u0440\u043E\u0438\u0433\u0440\u0430\u043B\u0438";
            this.Unsubscribe();

        }

    }

    Bomb() {
        if (this.bombQantity > 0 && !this.bomb) {
            this.bomb = true;
            this.bombQantity--;
            this.UpdateGameplay();
        }
    }

    Subscribe() {
        this.boardView.node.on('tile-click', (data: { x: number, y: number }) => {
            const getColor = this.coreboard.getColorTile(data.y, data.x);

            let sendingTile: Tile = new Tile(data.y, data.x, getColor - 1);
            if (this.bomb) {
                this.coreboard.tryDestroy(sendingTile, true);
                this.bomb = false;
            }
            else {
                this.coreboard.tryDestroy(sendingTile, false);
            }
            this.DestroyTiles();
        });

    }

    UpdateBoard() {
        this.boardView.clearBoard();

        this.boardView.init(this.coreboard.rows, this.coreboard.cols);
        for (let y = this.coreboard.rows - 1; y >= 0; y--) {
            for (let x = 0; x < this.coreboard.cols; x++) {
                const colorName: string = TileColor[this.coreboard.board[y][x] - 1];
                this.boardView.createTile(x, y, colorName)
            }
        }
    }

    DestroyTiles() {
        this.boardView.init(this.coreboard.rows, this.coreboard.cols);
        let quantityTiles: number = 0;
        //Coors witch need destroy
        for (let y = this.coreboard.rows - 1; y >= 0; y--) {
            for (let x = 0; x < this.coreboard.cols; x++) {
 
                if (this.coreboard.board[y][x] === 0) {
                    quantityTiles++;
                    this.boardView.destroyTile(x, y, () => {

                    });
                }
            }
        }
        //Update score
        this.gamePlay.addScore(quantityTiles);
        quantityTiles = 0;

        this.scheduleOnce(() => {
            this.DropTiles();
        }, 0.1);
    }

    DropTiles() {
        this.droplist = this.coreboard.dropTiles();
        if (this.droplist.length === 0) {
            this.UpdateBoard();
            this.AddNewTiles();
        }
        else {
            for (let point of this.droplist) {
                const move = { x: point.xdl, fromY: point.yFrom, toY: point.yTo };
                this.boardView.animateDrop(move, () => {
                    this.UpdateBoard();
                    this.AddNewTiles();
                })
            }
        }
    }

    AddNewTiles() {
        this.coreboard.addAfterDrop();


        for (let y = this.coreboard.rows - 1; y >= 0; y--) {
            for (let x = 0; x < this.coreboard.cols; x++) {
                if (this.coreboard.board[y][x] !== 0) {
                    const tileView = this.boardView.getTileView(x, y);
                    if (!tileView) {
                        const colorName: string = TileColor[this.coreboard.board[y][x] - 1];
                        this.boardView.createTile(x, y, colorName);

                        const newTileView = this.boardView.getTileView(x, y);
                        if (newTileView) {
                            newTileView.playSpawnAnimation();
                        }
                    }
                }
            }

            this.scheduleOnce(() => {
                this.boardView.clearBoard();
                this.boardView.init(this.coreboard.rows, this.coreboard.cols);

                for (let y = this.coreboard.rows - 1; y >= 0; y--) {
                    for (let x = 0; x < this.coreboard.cols; x++) {
                        if (this.coreboard.board[y][x] !== 0) {
                            const colorName: string = TileColor[this.coreboard.board[y][x] - 1];
                            this.boardView.createTile(x, y, colorName);
                        }
                    }
                }
                
            }, 0.05);
        }
        this.UpdateGameplay();
    }
  
    public Unsubscribe(): void {
        this.boardView.node.off('tile-click');
    }

}
