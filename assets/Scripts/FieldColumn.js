import GameParameters from './GameParameters';
import TileFabric from './TileFabric';
import Tile from './Tile';
import Supertile from './Supertile';

export default cc.Class({
    extends: cc.Component,

    properties: {
        _tiles: {
            default: [],
            type: [Tile]
        },
        tileFabric: {
            default: null,
            type: TileFabric
        }
    },

    startColumn() {
        this._updateTiles();
    },

    _updateTiles(supertileIndex, supertileType) {
        // to create new tiles above recently generated after removing 2 blocks in one column very fast
        const topExistingTileYCoord = Math.max(...this._tiles.map(tile => tile.node.position.y));
        let tileYCoord = Math.max(GameParameters.rows * GameParameters.tileSize.height, topExistingTileYCoord + GameParameters.tileSize.height);
        let moveDelay = 0;

        if (supertileType !== undefined) {
            const supertileNode = this.tileFabric.createSupertile(supertileType);
            supertileNode.parent = this.node;

            this._tiles = [
                ...this._tiles.slice(0, supertileIndex),
                supertileNode.getComponent(Supertile),
                ...this._tiles.slice(supertileIndex)
            ];

            const yCoord = this._tiles[supertileIndex - 1].node.position.y + GameParameters.tileSize.height;
            supertileNode.setPosition(0, yCoord);

            supertileNode.getComponent(Supertile).moveDelay = moveDelay;
        }

        while (this._tiles.length < GameParameters.rows) {
            const tileNode = this.tileFabric.create();
            tileNode.parent = this.node;
            this._tiles.push(tileNode.getComponent(Tile));
            tileNode.setPosition(0, tileYCoord);
            tileNode.getComponent(Tile).moveDelay = moveDelay;

            tileYCoord += GameParameters.tileSize.height;
            moveDelay += 0.1;
        }

        this.node.width = GameParameters.tileSize.width;
        this.node.height = GameParameters.tileSize.height * this._tiles.length;
        this._positionTiles();
    },

    _positionTiles() {
        this._tiles.forEach((tile, index) => {
            const position = new cc.Vec3(0, index * GameParameters.tileSize.height);
            tile.moveTo(position);
        });
    },

    getTileColor(index) {
        return this._tiles[index].color;
    },

    getSupertileType(index) {
        return this._tiles[index].supertileType;
    },

    blast(indexList) {
        indexList.sort((a, b) => b - a);
        indexList.forEach(index => {
            this._tiles[index].blast();
            this._tiles.splice(index, 1);
        });

        this._updateTiles();
    },

    blastCreatingSupertile(indexList, index, supertileType) {
        indexList.sort((a, b) => b - a);
        indexList.forEach(index => {
            this._tiles[index].blast();
            this._tiles.splice(index, 1);
        });
        this._updateTiles(index, supertileType);
    },

    isTileMoving(index) {
        return this._tiles[index].isMoving;
    },

    getTiles() {
        return this._tiles;
    },

    setTiles(tiles) {
        this._tiles = tiles;
        this._tiles.forEach(tile => {
            const globalPosition = tile.node.convertToWorldSpaceAR(new cc.Vec3());
            tile.node.parent = this.node;
            const localPosition = this.node.convertToNodeSpaceAR(globalPosition);
            tile.node.position = localPosition;
        });

        this._positionTiles();
    },

    setTileSelected(index, isSelected) {
        this._tiles[index].node.opacity = isSelected ? 150 : 255;
    }
});
