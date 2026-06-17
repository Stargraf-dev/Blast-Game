// core/GameState.ts
// Только данные


export interface IGameState {
    currentScore: number;
    targetColorId: number;
    isGameOver: boolean;
    isVictory: boolean;
    targetScore: number;
}

//При создании класса мы вносим только количетсво необходимого для закрытия уровня опыта поэтому в контрукторе только targetScore
export class GameState implements IGameState {
    public currentScore: number = 0;
    public targetColorId: number = 0;
    public isGameOver: boolean = false;
    public isVictory: boolean = false;
    public targetScore: number = 50;
// Конструтор позволяет видеть то что необходимо внести в объект этого класса при создании
    constructor(targetScore: number = 50) {
        this.targetScore = targetScore;
    }
//Добавляем счет при успешном угадывании цвета
    public addScore(amount: number): void {
        this.currentScore += amount;
        if (this.currentScore >= this.targetScore && !this.isGameOver) {
            this.isVictory = true;
            this.isGameOver = true;
        }
    }
//Изменяем целевой цвет верхнего интерфейса, который нужно нажать на нижнем
    public setTargetColor(colorId: number): void {
        this.targetColorId = colorId;
    }
//Резетим текущий счет и конецИгры и победу
    public reset(): void {
        this.currentScore = 0;
        this.isGameOver = false;
        this.isVictory = false;
    }
}



