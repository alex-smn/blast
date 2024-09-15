export const GameResult = Object.freeze({
    VICTORY: 0,
    DEFEAT: 1
})

export default cc.Class({
    extends: cc.Component,

    properties: {
        resultTitle: {
            default: null,
            type: cc.Label
        },
        playAgainButton: {
            default: null,
            type: cc.Button
        },
        mainMenuButton: {
            default: null,
            type: cc.Button
        },
        _gameResult: GameResult.VICTORY
    },

    onLoad() {
        cc.systemEvent.on('result-passed', this.handleResultPassed, this);
    },

    handleResultPassed(result) {
        this._gameResult = result;
        this.resultTitle.string = result == GameResult.VICTORY ? "Победа" : "Поражение";
    },

    onDestroy() {
        cc.systemEvent.off('data-passed', this.handleResultPassed, this);
    },

    onPlayAgainButton() {
        cc.director.loadScene("Game");
    },

    onMainMenuButton() {
        cc.director.loadScene("StartMenu");
    }
});
