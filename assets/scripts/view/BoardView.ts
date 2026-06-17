const { ccclass, property } = cc._decorator;

declare const cc: any;

@ccclass('BoardView')
export default class BoardView extends cc.Component {

    @property(cc.Prefab)
    public tilePrefab: cc.Prefab = null;

    @property
    public tileSize: number = 200;

    @property
    public spacing: number = 25;

    private tileViews: any[][] = []; 
    private boardContainer: cc.Node = null;
    private rows: number = 0;
    private cols: number = 0;


    public init(rows: number, cols: number): void {
        this.rows = rows;
        this.cols = cols;

        // Create continer
        this.boardContainer = new cc.Node('BoardContainer');
        this.boardContainer.parent = this.node;
    }

    public createTile(x: number, y: number, color: string): void {
        // add Y if it dont
        if (!this.tileViews[y]) {
            this.tileViews[y] = [];
        }
        const tileNode = cc.instantiate(this.tilePrefab);
        // tileNode is epty and inside all elements
        tileNode.parent = this.boardContainer;
        // Position
        const startX = -((this.cols - 1) * (this.tileSize + this.spacing)) / 2;
        const startY = ((this.rows - 1) * (this.tileSize + this.spacing)) / 2;
        const posX = startX + x * (this.tileSize + this.spacing);
        const posY = startY - y * (this.tileSize + this.spacing);
        tileNode.setPosition(cc.v3(posX, posY, 0));


        //get script TileView
        const tileView = tileNode.getComponent('TileView');
        tileView.init(x, y, color);

        this.tileViews[y][x] = tileView;

        // Click
        tileNode.on('touchstart', () => {
            this.onTileClick(x, y);
        });
    }

 

    private onTileClick(x: number, y: number): void {

        this.node.emit('tile-click', { x, y });
    }


    public destroyTile(x: number, y: number, callback?: () => void): void {
        if (this.tileViews[y] && this.tileViews[y][x]) {
            this.tileViews[y][x].playDestroyAnimation(callback);
        }
    }

    public dropTile(x: number, y: number, targetY: number, callback?: () => void): void {
        if (this.tileViews[y] && this.tileViews[y][x]) {
            const targetPosY = this.calculateYPosition(targetY);
            this.tileViews[y][x].playDropAnimation(targetPosY, callback);
        }
    }

    public calculateYPosition(y: number): number {
        const startY = ((this.rows - 1) * (this.tileSize + this.spacing)) / 2;
        return startY - y * (this.tileSize + this.spacing);
    }
    public clearBoard(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.tileViews[y] && this.tileViews[y][x]) {
                    this.tileViews[y][x].node.destroy();
                }
            }
        }
        this.tileViews = [];
    }

    public animateDrop(move: { x: number, fromY: number, toY: number }, callback: () => void) {
        const tile = this.tileViews[move.fromY][move.x]; // droping tile
        const targetPos = this.calculateYPosition(move.toY);

        // Anim drop
        cc.tween(tile.node)
            .to(0.2, { position: cc.v3(tile.node.position.x, targetPos, 0) }, { easing: 'bounceOut' })
            .call(() => callback())
            .start();

        // update tile in massive
        this.tileViews[move.toY][move.x] = tile;
        this.tileViews[move.fromY][move.x] = null;
    }

    public getTileView(x: number, y: number): any {
        if (this.tileViews[y] && this.tileViews[y][x]) {
            return this.tileViews[y][x];
        }
        return null;
    }









}