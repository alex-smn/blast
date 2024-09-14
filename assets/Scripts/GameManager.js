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
    	}
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
    },

    onDestroy() {
        this.fieldContainer.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
    }
});
