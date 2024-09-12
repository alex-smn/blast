import GameParameters from './GameParameters';
const {ccclass, property} = cc._decorator;

export default cc.Class({
    extends: cc.Component,

    properties: {
    	tileNode: {
    		default: null,
            type: cc.Node
    	},
    	sprite: {
    		default: null,
            type: cc.Sprite
    	},
    	color: GameParameters.tileColors.blue
    }
});
