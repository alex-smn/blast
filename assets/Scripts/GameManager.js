import GameParameters from './GameParameters';
import TileItem from './TileItem'
import Field from './Field'

cc.Class({
    extends: cc.Component,

    properties: {
    	panelButtonPlay: {
    		default: null,
            type: cc.Node
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

	},

	startGame() {
		this.panelButtonPlay.active = false;
		this.fieldContainer.getComponent(Field).startField();

		this.fieldBackground.active = true;
		this.fieldBackground.width = GameParameters.columns * GameParameters.tileSize.width + 88;
		this.fieldBackground.height = GameParameters.rows * GameParameters.tileSize.height + 88;

		this.fieldContainer.node.width = GameParameters.columns * GameParameters.tileSize.width;
		this.fieldContainer.node.height = GameParameters.rows * GameParameters.tileSize.height;
		this.fieldContainer.node.setPosition (-this.fieldContainer.node.width / 2, -this.fieldContainer.node.height / 2);

        this.fieldContainer.node.on(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
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
