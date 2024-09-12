import GameParameters from './GameParameters';
const {ccclass, property} = cc._decorator;

export default cc.Class({
    extends: cc.Component,

    properties: {
    	tileNode: {
    		default: null,
            type: cc.Node
    	},
    	tileSprite: {
    		default: null,
            type: cc.Sprite
    	},
    	tileColor: GameParameters.tileColors.blue,
    	tileId: -1,
    	leftId: -1,
    	rightId: -1,
    	topId: -1,
    	bottomId: -1
    },

	startEvent: function() {
		this.tileNode.on(cc.Node.EventType.TOUCH_END, (event) => {
			console.log(this.tileId);
		});
	}
});
