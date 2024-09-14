import GameParameters from './GameParameters';
import Field from './Field'
import EffectsManager from './EffectsManager';

cc.Class({
    extends: cc.Component,

    properties: {
		effectsManager: {
			default: null,
			type: EffectsManager
		},
    	fieldContainer: {
    		default: null,
            type: Field
    	},
    	fieldBackground: {
    		default: null,
    		type: cc.Node
    	},
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
	},

	onGridTouch(event) {
        const touchLocation = event.touch.getLocation();
        const localTouchLocation = this.fieldContainer.node.convertToNodeSpaceAR(touchLocation);

        this.fieldContainer.onClick(localTouchLocation.x, localTouchLocation.y);

		if (!this.fieldContainer.hasPossibleMoves()) {
			if (this._shuffleCount == 0) {
				console.log("No moves available");
			} else {
				console.log("SHUFFLE!");
				this._shuffleCount--;
				this.fieldContainer.shuffle();
			}
		}
    },

    onDestroy() {
        this.fieldContainer.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
    }
});
