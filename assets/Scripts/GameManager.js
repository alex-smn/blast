import GameParameters from './GameParameters';
import Field from './Field'
import EffectsManager from './EffectsManager';
import ScoreManager from './ScoreManager';
import GameMechanicsManager from './GameMechanicsManager';

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
    	fieldBackground: {
    		default: null,
    		type: cc.Node
    	},
		movesLabel: {
			default: null,
			type: cc.Label
		},
		_moves: GameParameters.startMovesCount,
		_shuffleCount: GameParameters.shuffleCount
    },

	onLoad() {
		this.fieldBackground.width = GameParameters.columns * GameParameters.tileSize.width + 88;
		this.fieldBackground.height = GameParameters.rows * GameParameters.tileSize.height + 88;


        this.node.on(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);

		this.effectsManager.node.setPosition (-this.gameMechanicsManager.node.width / 8, -this.gameMechanicsManager.node.height / 8);

		this.movesLabel.string = this._moves;
	},

	onGridTouch(event) {
        const touchLocation = event.touch.getLocation();

		if (this.gameMechanicsManager.onTileClicked(touchLocation)) {
			this._updateMoves();
			this._checkGameState();
		}
    },

	_updateMoves() {	
		this._moves--;
		this.movesLabel.string = this._moves;
	},

	_checkGameState() {
		if (this.scoreManager.getCurrentScore() >= GameParameters.targetPoints) {
			console.log("VICTORY");
			return;
		}

		if (this._moves == 0 || !this.gameMechanicsManager.canHavePossibleMoves()) {
			console.log("DEFEAT");
			return;
		}

		if (!this.gameMechanicsManager.hasPossibleMoves()) {
			if (this._shuffleCount == 0) {
				console.log("No moves available");
			} else {
				console.log("SHUFFLE!");
				this._shuffleCount--;
				this.gameMechanicsManager.requestShuffle();
			}
		}
	},

    onDestroy() {
        this.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
    }
});
