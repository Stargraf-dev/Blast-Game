export enum TileColor {
    blue,
    green,
    purple,
    red,
    yellow
}

export class Tile {
    public color: TileColor;
    public x: number;
    public y: number;

    constructor(y: number, x: number, color: TileColor,) {
        this.color = color;
        this.x = x;
        this.y = y;
    }
}