import GameParameters from './GameParameters';
import ScoreManager from './ScoreManager';
import Field from './Field';
import BoosterManager from './BoosterManager';
import { SupertilesThreshold, SupertileType } from './Supertile';

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

        console.log(this.field.getSupertileType(col, row));

        if (this.field.getSupertileType(col, row) !== undefined) {
            const supertileType = this.field.getSupertileType(col, row);
            return this._blastSupertile(col, row, supertileType);
        }

        const color = this.field.getTileColor(col, row);
        const tilesToBlast = this._getTileNeighboursOfSameColor(col, row, color);
        if (tilesToBlast.length >= GameParameters.minTilesToBlast) {
            if (tilesToBlast.length >= GameParameters.supertileMinThreshold) {
                let supertileType;
                if (tilesToBlast.length >= SupertilesThreshold.MEGABOMB) {
                    supertileType = SupertileType.MEGABOMB;
                } else if (tilesToBlast.length === SupertilesThreshold.BOMB) {
                    supertileType = SupertileType.BOMB;
                } else if (tilesToBlast.length === SupertilesThreshold.VERTICAL) {
                    supertileType = SupertileType.VERTICAL;
                } else if (tilesToBlast.length === SupertilesThreshold.HORIZONTAL) {
                    supertileType = SupertileType.HORIZONTAL;
                }
                this.field.blastTilesCreatingSupertile(tilesToBlast, col, row, supertileType);
            } else {
                this.field.blastTiles(tilesToBlast);
            }

            this.scoreManager.onBlast(tilesToBlast.length);
            return true;
        }

        return false;
    },

    _blastSupertile(col, row, supertileType) {
        const tilesToBlast = [];

        switch (supertileType) {
            case SupertileType.HORIZONTAL:
                for (let colIndex = 0; colIndex < GameParameters.columns; colIndex++) {
                    console.log(colIndex, row);
                    tilesToBlast.push({ col: colIndex, row: row });
                }
                break;
            case SupertileType.VERTICAL:
                for (let rowIndex = 0; rowIndex < GameParameters.rows; rowIndex++) {
                    tilesToBlast.push({ col: col, row: rowIndex });
                }
                break;
            case SupertileType.BOMB:
                tilesToBlast.push(...this._getTileNeighboursInRadius(col, row, GameParameters.bombRadius));
                break;
            case SupertileType.MEGABOMB:
                tilesToBlast.push(...this._getAllTiles());
                break;
        }

        console.log(tilesToBlast);

        this.field.blastTiles(tilesToBlast);
        this.scoreManager.onBlast(tilesToBlast.length);

        return true;
    },

    _getTileNeighboursOfSameColor(col, row, color) {
        const tiles = [{ col: col, row: row }];

        const checkNeighbours = (col, row, color) => {
            const neighbours = this._findTileNeighbours(col, row);

            neighbours.forEach(neighbour => {
                const tileColor = this.field.getTileColor(neighbour.col, neighbour.row);
                const exists = tiles.some(tile => tile.col == neighbour.col && tile.row == neighbour.row);

                if (tileColor.toRGBValue() == color.toRGBValue() && !exists) {
                    tiles.push(neighbour);

                    checkNeighbours(neighbour.col, neighbour.row, color);
                }
            });
        };

        checkNeighbours(col, row, color);

        return tiles;
    },

    _getTileNeighboursInRadius(col, row, radius) {
        const tiles = [];

        for (let x = col - radius; x <= col + radius; x++) {
            for (let y = row - radius; y <= row + radius; y++) {
                if (x >= 0 && x < GameParameters.columns && y >= 0 && y < GameParameters.rows) {
                    tiles.push({ col: x, row: y })
                }
            }
        }

        return tiles;
    },

    _getAllTiles() {
        const tiles = [];

        for (let col = 0; col < GameParameters.columns; col++) {
            for (let row = 0; row < GameParameters.rows; row++) {
                tiles.push({ col: col, row: row });
            }
        }

        return tiles;
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
            neighbours.push({ col: col - 1, row: row });
        }
        if (col < GameParameters.columns - 1) {
            neighbours.push({ col: col + 1, row: row });
        }
        if (row > 0) {
            neighbours.push({ col: col, row: row - 1 });
        }
        if (row < GameParameters.rows - 1) {
            neighbours.push({ col: col, row: row + 1 });
        }

        return neighbours;
    }
});
