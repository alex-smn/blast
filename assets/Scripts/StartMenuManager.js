cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Button
        }
    },

    onStartButton() {
        cc.director.loadScene("Game");
    }
});
