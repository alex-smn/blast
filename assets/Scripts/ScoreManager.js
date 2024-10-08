import GameParameters from './GameParameters';

export default cc.Class({
	extends: cc.Component,

	properties: {
		scoreLabel: {
			default: null,
			type: cc.Label
		},
		_score: 0
	},

	onLoad() {
		this.scoreLabel.string = `${this._score} / ${GameParameters.targetPoints}`;
	},

	onBlast(tilesBlasted) {
		const newScore = 5 * tilesBlasted ** 2 - 15 * tilesBlasted + 30;

		this._score += newScore;
		this._updateLabel();
	},

	addScore(add) {
		this._score += add;
		this._updateLabel();
	},

	getCurrentScore() {
		return this._score;
	},

	_updateLabel() {
		this.scoreLabel.string = `${this._score} / ${GameParameters.targetPoints}`;
	}
});
