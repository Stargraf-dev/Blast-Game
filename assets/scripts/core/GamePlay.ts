export interface IGamePlay {
    currentScore: number;
    targetScore: number;
    moves: number;
    isVictory: boolean;
    isGameOver: boolean;
}

export class GamePlay implements IGamePlay {
    public currentScore: number = 0;
    public targetScore: number = 50;
    public moves: number = 17;
    public isVictory: boolean = false;
    public isGameOver: boolean = false;
    public scoreForTile:number = 20;
    private movesSave: number = this.moves;


    constructor(targetScore: number, moves: number, scoreForTile: number) {
        this.targetScore = targetScore;
        this.moves = moves;
        this.scoreForTile = scoreForTile;
    }

    public addScore(quantityTiles: number): void {
        this.currentScore += quantityTiles * this.scoreForTile;
        this.moves -= 1;
        if (this.currentScore >= this.targetScore && !this.isGameOver && this.moves > -1) {
            this.isVictory = true;
            this.isGameOver = true;
        }
        else if (this.moves <= 0 && !this.isVictory) {
            this.isGameOver = true;
        }
    }

    public reset(): void {
        this.currentScore = 0;
        this.isGameOver = false;
        this.isVictory = false;
        this.moves = this.movesSave;
    }


}

