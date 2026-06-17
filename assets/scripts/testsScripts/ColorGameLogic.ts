// core/ColorGameLogic.ts
// Чистая логика игры

import { GameState, IGameState } from './GameState';

export interface IColorGameLogic {
    getState(): GameState;
    processGuess(guessedColorId: number): { success: boolean; scoreChange: number; message: string };
    generateNewTargetColor(): void;
    resetGame(): void;
}



export class ColorGameLogic implements IColorGameLogic {
    private state: GameState;
    private maxColors: number;
    constructor(maxColors: number = 4, targetScore: number = 50) {
        this.state = new GameState(targetScore);
        this.maxColors = maxColors;
        this.generateNewTargetColor();
    }
    // метод имеет класс GameState потому что возвращает это значение
    public getState(): GameState {
        return this.state;
    }

    /**
     * Обработать ответ игрока
     */
    // мы передаем цвет который выбрал игрок, и успех, изменение счета, и сообщение выводим
    public processGuess(guessedColorId: number): { success: boolean; scoreChange: number; message: string } {
    //если игра окончена геймовер=тру выводим успех фолс, скор 0 и сообщение ты обосрался бобби
        if (this.state.isGameOver) {
            return { success: false, scoreChange: 0, message: "Игра окончена. Нажмите 'Новая игра'" };
        }
        //узнаем равен ли выбранный цвет пользователем загаданному цвету
        const isCorrect = (guessedColorId === this.state.targetColorId);
        //если да
        if (isCorrect) {
            const scoreChange = 10;
            this.state.addScore(scoreChange);
            this.generateNewTargetColor();
            return { success: true, scoreChange, message: "Правильно! +10" };
        } else {
            const scoreChange = -5;
            this.state.currentScore = Math.max(0, this.state.currentScore + scoreChange);

            // Проверяем, не проиграли ли мы (по желанию: можно добавить условие проигрыша)
            // В этой игре проигрыша нет, просто штраф

            return { success: false, scoreChange, message: "Неправильно! -5" };
        }
    }

    /**
     * Сгенерировать новый целевой цвет
     */
    public generateNewTargetColor(): void {
        const newColor = Math.floor(Math.random() * this.maxColors);
        this.state.setTargetColor(newColor);
    }

    /**
     * Перезапустить игру
     */
    public resetGame(): void {
        this.state.reset();
        this.generateNewTargetColor();
    }
}


export class test {
    testovaya: ColorGameLogic = new ColorGameLogic(5,19);

    

}