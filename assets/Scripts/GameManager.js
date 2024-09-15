import GameParameters from './GameParameters';
import Field from './Field'
import EffectsManager from './EffectsManager';
import ScoreManager from './ScoreManager';

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
    	fieldContainer: {
    		default: null,
            type: Field
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

		this.fieldContainer.node.width = GameParameters.columns * GameParameters.tileSize.width;
		this.fieldContainer.node.height = GameParameters.rows * GameParameters.tileSize.height;
		this.fieldContainer.node.setPosition (-this.fieldContainer.node.width / 2, -this.fieldContainer.node.height / 2);

        this.fieldContainer.node.on(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);

		this.effectsManager.node.setPosition (-this.fieldContainer.node.width / 8, -this.fieldContainer.node.height / 8);

		this.movesLabel.string = this._moves;
	},

	onGridTouch(event) {
        const touchLocation = event.touch.getLocation();
        const localTouchLocation = this.fieldContainer.node.convertToNodeSpaceAR(touchLocation);

		if (this.fieldContainer.onClick(localTouchLocation.x, localTouchLocation.y)) {
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

		if (this._moves == 0 || !this.fieldContainer.canHavePossibleMoves()) {
			console.log("DEFEAT");
			return;
		}

		if (!this.fieldContainer.hasPossibleMoves()) {
			if (this._shuffleCount == 0) {
				console.log("No moves available");
			} else {
				console.log("SHUFFLE!");
				this._shuffleCount--;
				this.fieldContainer.requestShuffle();
			}
		}
	},

    onDestroy() {
        this.fieldContainer.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
    }
});
