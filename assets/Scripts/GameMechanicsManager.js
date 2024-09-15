import GameParameters from './GameParameters';
import ScoreManager from './ScoreManager';
import Field from './Field';
import BoosterManager from './BoosterManager';

export default cc.Class({
    extends: cc.Component,

    properties: {
        scoreManager: {
            default: null,
            type: ScoreManager
        },
        boosterManager: {
            default: null,
            type: BoosterManager
        },
        field: {
            default: null,
            type: Field
        },
        _shuffleRequired: false
    },

    start() {
        this._shuffleIfNeeded();
    },

    update() {
        if (this._shuffleRequired == true) {
            if (!this.field.hasMovingTiles()) {
                this._shuffleRequired = false;
                this._shuffle();
            }
        }
    },

    onClick(location) {
        const indices = this.field.getTileIndicesFromCoords(location);

        if (indices) {
            return this._onTileClick(indices.col, indices.row);
        }

        return false;
    },

    checkLocationIsInField(location) {
        return this.field.getTileIndicesFromCoords(location) != null;
    },

    hasPossibleMoves() {
        for (let col = 0; col < GameParameters.columns; col++) {
            for (let row = 0; row < GameParameters.rows; row++) {
                const tilesToBlast = this._getTileNeighboursOfSameColor(col, row, this.field.getTileColor(col, row));
                if (tilesToBlast.length >= GameParameters.minTilesToBlast) {
                    return true;
                }
            }
        }

        return false;
    },

    canHavePossibleMoves() {
        let tiles = {};

        for (let col = 0; col < GameParameters.columns; col++) {
            for (let row = 0; row < GameParameters.rows; row++) {
                const color = this.field.getTileColor(col, row);
                if (tiles[color]) {
                    tiles[color]++;

                    if (tiles[color] >= GameParameters.minTilesToBlast) {
                        return true;
                    }
                } else {
                    tiles[color] = 1;
                }
            }
        }

        return false;
    },

    requestShuffle() {
        this._shuffleRequired = true;
    },

    _onTileClick(col, row) {
        if (this.field.isTileMoving(col, row)) {
            return false;
        }

        const color = this.field.getTileColor(col, row);
        const tilesToBlast = this._getTileNeighboursOfSameColor(col, row, color);
        if (tilesToBlast.length >= GameParameters.minTilesToBlast) {
            this.field.blastTiles(tilesToBlast);

            this.scoreManager.onBlast(tilesToBlast.length);
            return true;
        }

        return false;
    },

    

    _getTileNeighboursOfSameColor(col, row, color) {
        const tilesToBlast = [{col: col, row: row}];

        const checkNeighbours = (col, row, color) => {
            const neighbours = this._findTileNeighbours(col, row);

            neighbours.forEach(neighbour => {
                const tileColor = this.field.getTileColor(neighbour.col, neighbour.row);
                const exists = tilesToBlast.some(tile => tile.col == neighbour.col && tile.row == neighbour.row);
                
                if (tileColor.toRGBValue() == color.toRGBValue() && !exists) {
                    tilesToBlast.push(neighbour);

                    checkNeighbours(neighbour.col, neighbour.row, color);
                }
            });
        };

        checkNeighbours(col, row, color);

        return tilesToBlast;
    },

    _shuffle() {
        let tiles = this.field.getTiles();

        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }

        this.field.setTiles(tiles);

        this._shuffleIfNeeded();
    },

    _shuffleIfNeeded() {
        if (!this.hasPossibleMoves()) {
            this._shuffle();
        }
    },

    _findTileNeighbours(col, row) {
        const neighbours = [];

        if (col > 0) {
            neighbours.push({col: col - 1, row: row});
        }
        if (col < GameParameters.columns - 1) {
            neighbours.push({col: col + 1, row: row});
        }
        if (row > 0) {
            neighbours.push({col: col, row: row - 1});
        }
        if (row < GameParameters.rows - 1) {
            neighbours.push({col: col, row: row + 1});
        }

        return neighbours;
    }
});
