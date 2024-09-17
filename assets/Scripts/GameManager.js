import GameParameters from './GameParameters';
import EffectsManager from './EffectsManager';
import ScoreManager from './ScoreManager';
import GameMechanicsManager from './GameMechanicsManager';
import BoosterManager from './BoosterManager';
import { GameResult } from './EndMenuManager';

cc.Class({
    extends: cc.Component,

    properties: {
		effectsManager: {
			default: null,
			type: EffectsManager
		},
		scoreManager: {
			default: null,
			type: ScoreManager
		},
    	gameMechanicsManager: {
    		default: null,
            type: GameMechanicsManager
    	},
		boosterManager: {
			default: null,
			type: BoosterManager
		},
		fieldContainer: {
			default: null,
			type: cc.Node
		},
    	fieldBackground: {
    		default: null,
    		type: cc.Node
    	},
		statsContainer: {
			default: null,
    		type: cc.Node
		},
		boostersContainer: {
			default: null,
    		type: cc.Node
		},
		movesLabel: {
			default: null,
			type: cc.Label
		},
		pauseButton: {
			default: null,
			type: cc.Button
		},
		pauseMenuContainer: {
			default: null,
			type: cc.Node
		},
		_moves: 0,
		_shuffleCount: 0 
    },

	onLoad() {
		this.fieldBackground.width = GameParameters.columns * GameParameters.tileSize.width + 88;
		this.fieldBackground.height = GameParameters.rows * GameParameters.tileSize.height + 88;

		this._moves = GameParameters.startMovesCount;
		this._shuffleCount = GameParameters.shuffleCount;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);

		this.effectsManager.node.setPosition (-this.gameMechanicsManager.node.width / 8, -this.gameMechanicsManager.node.height / 8);

		this.movesLabel.string = this._moves;
	},

	start() {
		this._checkBoostersState();
	},

	onGridTouch(event) {
        const touchLocation = event.touch.getLocation();

		if (this.gameMechanicsManager.checkLocationIsInField(touchLocation)) {
			const selectedBooster = this.boosterManager.getSelectedBooster();

			if (selectedBooster) {
				if (this.boosterManager.performBooster(touchLocation)) {
					this._updateScore(-selectedBooster.getPrice());
				}
			} else if (this.gameMechanicsManager.onClick(touchLocation)) {
				this._updateMoves();
			}

			this._checkGameState();
			this._checkBoostersState();
		} else {
			this.boosterManager.onClick(touchLocation);
		}
    },

	onPauseButton() {
		this._showPauseMenu(true);
	},

	onMainMenuButton() {
		cc.director.loadScene("StartMenu");
	},

	onResumeButton() {
		this._showPauseMenu(false);
	},
 
	_updateMoves() {	
		this._moves--;
		this.movesLabel.string = this._moves;
	},

	_updateScore(add) {
		this.scoreManager.addScore(add);
	},

	_checkGameState() {
		if (this.scoreManager.getCurrentScore() >= GameParameters.targetPoints) {
			this._endGame(GameResult.VICTORY);
		}

		if (this._moves == 0 || !this.gameMechanicsManager.canHavePossibleMoves()) {
			this._endGame(GameResult.DEFEAT);
		}

		if (!this.gameMechanicsManager.hasPossibleMoves()) {
			if (this._shuffleCount == 0) {
				this._endGame(GameResult.DEFEAT);
			} else {
				this._shuffleCount--;
				this.gameMechanicsManager.requestShuffle();
			}
		}
	},

	_endGame(result) {
		cc.director.loadScene("EndMenu", () => {
			cc.systemEvent.emit('result-passed', result);
		});
	},

	_checkBoostersState() {
		this.boosterManager.boosters.forEach(booster => {
			booster.setIsEnabled(this.scoreManager.getCurrentScore() >= booster.getPrice());
		});
	},

	_showPauseMenu(isVisible) {
		this.pauseButton.node.active = !isVisible;
		this.fieldContainer.active = !isVisible;
		this.statsContainer.active = !isVisible;
		this.boostersContainer.active = !isVisible;

		this.pauseMenuContainer.active = isVisible;

		if (isVisible) {
			this.node.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
		} else {
			this.node.on(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
		}
	},

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
    }
});
