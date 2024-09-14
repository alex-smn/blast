import GameParameters from './GameParameters';
import TileFabric from './TileFabric'
import TileItem from './TileItem'

export default cc.Class({
    extends: cc.Component,

    properties: {
        _tiles: {
            default: [],
            type: [TileItem]
        },
        tileFabric: {
            default: null,
            type: TileFabric
        }
    },

    startColumn() {
        this._updateTiles();
    },

    _updateTiles() {
        // to create new tiles above newly generated after removing 2 blocks in one column very fast
        let topExistingTileYCoord = Math.max(...this._tiles.map(tile => tile.node.position.y));
        let tileYCoord = Math.max(GameParameters.rows * GameParameters.tileSize.height, topExistingTileYCoord + GameParameters.tileSize.height);
        let moveDelay = 0;

        while (this._tiles.length < GameParameters.rows) {
            const tileNode = this.tileFabric.create();
            tileNode.parent = this.node;
            this._tiles.push(tileNode.getComponent(TileItem));

            tileNode.setPosition(0, tileYCoord);
            tileNode.getComponent(TileItem).moveDelay = moveDelay;

            tileYCoord += GameParameters.tileSize.height;
            moveDelay += 0.1;
        }

        this.node.width = GameParameters.tileSize.width;
        this.node.height = GameParameters.tileSize.height * this._tiles.length;
        this._positionTiles();
    },

    _positionTiles() {
        this._tiles.forEach((tile, index) => {
            tile.moveTo(index * GameParameters.tileSize.height);
        })
    },

    getTileColor(index) {
        return this._tiles[index].color;
    },

    blast(indexList) {
        indexList.sort((a, b) => b - a);
        indexList.forEach(index => {
            this._tiles[index].blast();
            this._tiles.splice(index, 1);
        });
        
        this._updateTiles();
    },

    isTileMoving(index) {
        return this._tiles[index].isMoving;
    }
});
