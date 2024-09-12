import GameParameters from './GameParameters';
const {ccclass, property} = cc._decorator;

export default cc.Class({
    extends: cc.Component,

    properties: {
    	color: GameParameters.tileColors.blue
    }
});
