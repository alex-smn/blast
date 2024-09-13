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
        while (this._tiles.length < GameParameters.rows) {
            const tile = this.tileFabric.create();
            tile.parent = this.node;
            this._tiles.push(tile.getComponent(TileItem));
        }

        this.node.width = GameParameters.tileSize.width;
        this.node.height = GameParameters.tileSize.height * this._tiles.length;

        this._positionTiles();
    },

    _positionTiles() {
        this._tiles.forEach((tile, index) => {
            tile.node.setPosition(0, index * GameParameters.tileSize.height);
        })
    },

    getTileColor(index) {
        return this._tiles[index].color;
    },

    blast(indexList) {
        indexList.sort((a, b) => b - a);
        indexList.forEach(index => {
            const tileNode = this._tiles[index].node;
            tileNode.destroy();
            this._tiles.splice(index, 1);
        });
        
        this._updateTiles();
    }
});
