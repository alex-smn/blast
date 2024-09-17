const { default: ScoreManager } = require("../assets/Scripts/ScoreManager");

test('Add 150 score', () => {
    const scoreManager = new ScoreManager();
    
    scoreManager.scoreLabel = createLabel();

    scoreManager.addScore(150);
    expect(scoreManager.getCurrentScore()).toBe(150);
});

function createLabel() {
    const label = new cc.Label();
    label.node = new cc.Node();

    return label;
}