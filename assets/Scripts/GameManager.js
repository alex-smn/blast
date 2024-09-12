import GameParameters from './GameParameters';
import TileItem from './TileItem'
import PrefabTileItem from './PrefabTileItem'
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
    

	onLoad() {
		this.field.width = GameParameters.columns * this.prefabParentTile.width + 120;
		this.field.height = GameParameters.rows * this.prefabParentTile.height + 120;
	},

    

	startGame() {
		this.panelButtonPlay.active = false;
		this.createGridTile();

        this.field.on(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
	},

	createGridTile() {
		this.field.removeAllChildren();

		const rowArray = [];
		const columnArray = [];

		for (let row = 0; row < GameParameters.rows; row++) {
			for (let col = 0; col < GameParameters.columns; col++) {
				const tileParent = cc.instantiate(this.prefabParentTile);
				const tileNode = cc.instantiate(this.prefabTiles[Math.floor(Math.random() * this.prefabTiles.length)]);
				const tileItem = tileParent.getComponent(TileItem);

				tileParent.parent = this.field;
				tileParent.name = `tileParent_${row}_${col}`;

				tileNode.parent = tileParent;
				tileNode.name = `tile_${row}_${col}`;

				tileItem.tileNode = tileNode;
				tileItem.sprite = tileNode.getComponent(cc.Sprite);
				tileItem.color = tileNode.getComponent(PrefabTileItem).color;
			} 
		}
	},

	onGridTouch(event) {
        const touchLocation = event.touch.getLocation();
        const localTouchLocation = this.field.convertToNodeSpaceAR(touchLocation);

        const gridSize = this.field.getContentSize();

        const col = Math.floor((localTouchLocation.x + gridSize.width / 2) / this.prefabParentTile.width);
        const row = Math.floor((gridSize.height / 2 - localTouchLocation.y) / this.prefabParentTile.height);

        if (col >= 0 && col < GameParameters.columns && row >= 0 && row < GameParameters.rows) {
            const index = row * GameParameters.columns + col;
            const touchedElement = this.field.children[index];
            const touchedItem = touchedElement.getComponent(TileItem);

            if (touchedItem) {
				const tilesToBlast = this._checkForBlast(index, touchedItem.color);
            	tilesToBlast.forEach(element => {
					const touchedElement = this.field.children[element];
	                touchedElement.opacity = 150;

		            // const touchedItem = touchedElement.getComponent(TileItem);
            	})

                console.log(`Touched element at row: ${row}, column: ${col}, index: ${index}, name: ${touchedElement.name}, color: ${touchedItem.color}`);

                // touchedElement.opacity = 150;
            }
        } else {
            console.log("Touch is outside the grid bounds.");
        }
    },

    _checkForBlast(index, color) {
    	const tilesToBlast = new Set([index]);

    	const checkNeighbours = (index, color) => {
	    	const neighbours = [index - 1, index + 1, index - GameParameters.columns, index + GameParameters.columns];

	    	neighbours.forEach(neighbour => {
				if (this._getTileColorByIndex(neighbour) === color && !tilesToBlast.has(neighbour)) {
					tilesToBlast.add(neighbour);
					checkNeighbours(neighbour, color);
	    		}
	    	});
    	};

    	checkNeighbours(index, color);

    	return tilesToBlast.size > 1 ? tilesToBlast : [];
    },

    _getTileColorByIndex(index) {
    	return this.field.children[index].getComponent(TileItem).color;
    },

    onDestroy() {
        this.field.off(cc.Node.EventType.TOUCH_START, this.onGridTouch, this);
    }
});
