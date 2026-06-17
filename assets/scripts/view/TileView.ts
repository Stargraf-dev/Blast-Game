const { ccclass, property } = cc._decorator;

declare const cc: any;

@ccclass('TileView')
export default class TileView extends cc.Component {
    @property(cc.Sprite)
    public blockSprite: any = null;

    @property(cc.SpriteFrame)
    public block_blue: any = null;

    @property(cc.SpriteFrame)
    public block_green: any = null;

    @property(cc.SpriteFrame)
    public block_purple: any = null;

    @property(cc.SpriteFrame)
    public block_red: any = null;

    @property(cc.SpriteFrame)
    public block_yellow: any = null;

    private _x: number = 0;
    private _y: number = 0;
    private _originalScale: cc.SpriteFrame = null;

    onLoad() {
        this._originalScale = cc.v3(this.node.scale.x, this.node.scale.y, this.node.scale.z);
    }


    public init(x: number, y: number, color: string): void {
        this._x = x;
        this._y = y;

        switch (color) {
            case 'blue':
                this.blockSprite.spriteFrame = this.block_blue;
                break;
            case 'green':
                this.blockSprite.spriteFrame = this.block_green;
                break;
            case 'purple':
                this.blockSprite.spriteFrame = this.block_purple;
                break;
            case 'red':
                this.blockSprite.spriteFrame = this.block_red;
                break;
            case 'yellow':
                this.blockSprite.spriteFrame = this.block_yellow;
                break;
        }
    }

    public playDestroyAnimation(callback?: any): void {
        cc.tween(this.node)
            .to(0.3, { scale: 0 })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }

    public playDropAnimation(targetY: number, callback?: any): void {
        cc.tween(this.node)
            .to(0.25, {
                position: cc.v2(this.node.position.x, targetY)
            }, {
                easing: 'quartOut'
            })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }

    public playSpawnAnimation(callback?: any): void {
        this.node.active = true;
        this.node.scale = cc.v3(0, 0, 0);

        cc.tween(this.node)
            .to(0.2, { scale: 1 })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }
}