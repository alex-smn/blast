import GameParameters from './GameParameters';
const {ccclass, property} = cc._decorator;

export default cc.Class({
    extends: cc.Component,

    properties: {
    	sprite: {
    		default: null,
            type: cc.Sprite
    	},
    	color: GameParameters.tileColors.blue
    }
});
