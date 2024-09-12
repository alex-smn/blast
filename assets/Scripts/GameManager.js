import GameParameters from './GameParameters';
import TileItem from './TileItem'
const {ccclass, property} = cc._decorator;

cc.Class({
    extends: cc.Component,

    properties: {
    	tiles: {
    		default: [],
            type: [cc.Sprite]
    	},
    	panelButtonPlay: {
    		default: null,
            type: cc.Node
    	},
    	field: {
    		default: null,
            type: cc.Node
    	},

    	prefabTiles: {
    		default: [],
            type: [cc.Node]
    	},
    	prefabParentTile: {
    		default: null,
            type: cc.Node
    	}
    },

	onLoad: function() {
		this.field.width = GameParameters.columns * this.prefabParentTile.width + 120;
		this.field.height = GameParameters.rows * this.prefabParentTile.height + 120;
		// GameGlobal.srcManager = this;
	},

	startGame: function() {
		this.panelButtonPlay.active = false;
		this.createGridTile();
	},

	createGridTile: function() {
		this.field.removeAllChildren();
		let rowArray = [];
		let columnArray = [];

		for (let row = 0; row < GameParameters.rows; row++) {
			for (let col = 0; col < GameParameters.columns; col++) {
				let id = row * GameParameters.columns + col;

				let tileParent = cc.instantiate(this.prefabParentTile);
				let tileNode = cc.instantiate(this.prefabTiles[Math.floor(Math.random() * this.prefabTiles.length)]);
				let tileItem = tileParent.getComponent(TileItem);

				tileParent.parent = this.field;
				tileParent.name = "tileParent_" + id.toString();

				tileNode.parent = tileParent;
				tileNode.name = "tile_" + id.toString();

				tileItem.tileNode = tileNode;
				tileItem.tileSprite = tileNode.getComponent(cc.Sprite);
				tileItem.tileId = id;

				tileItem.startEvent();
			} 
		}
	}
});
