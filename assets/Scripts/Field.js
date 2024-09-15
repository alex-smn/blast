import GameParameters from './GameParameters';
import FieldColumn from './FieldColumn';
import ScoreManager from './ScoreManager';

export default cc.Class({
    extends: cc.Component,

    properties: {
        scoreManager: {
            default: null,
            type: ScoreManager
        },
        columnPrefab: {
            default: null,
            type: cc.Node
        },
        _columns: {
            default: [],
            type: [FieldColumn]
        },
    },

    onLoad() {
        while (this._columns.length < GameParameters.columns) {
            const column = cc.instantiate(this.columnPrefab);
            column.parent = this.node;
            this._columns.push(column.getComponent(FieldColumn));
        }
        
        this._columns.forEach(col => col.startColumn());
        this._positionColumns();
    },

    _positionColumns() {
        this._columns.forEach((col, index) => {
            col.node.setPosition(index * GameParameters.tileSize.width, 0);
        })
    },

    onClick(x, y) {
        const col = Math.floor(x / GameParameters.tileSize.width);
        const row = Math.floor(y / GameParameters.tileSize.height);

        if (col >= 0 && col < GameParameters.columns && row >= 0 && row < GameParameters.rows) {
            return this._onTileClick(col, row);
        }
        
        return false;
    },

    _onTileClick(col, row) {
        if (this._columns[col].isTileMoving(row)) {
            return;
        }

        const color = this._columns[col].getTileColor(row);
        
        const tilesToBlast = this._getTileNeighboursOfSameColor(col, row, color);
        if (tilesToBlast.length >= GameParameters.minTilesToBlast) {
            this._columns.forEach((column, index) => {
                const columnTilesToBlast = tilesToBlast.filter((tile) => tile.col == index);
                if (columnTilesToBlast.length > 0) {
                    column.blast(columnTilesToBlast.map(tile => tile.row));
                }
            });

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
                const tileColor = this._columns[neighbour.col].getTileColor(neighbour.row);
                const exists = tilesToBlast.some(tile => tile.col === neighbour.col && tile.row == neighbour.row);
                
                if (tileColor.toRGBValue() == color.toRGBValue() && !exists) {
                    tilesToBlast.push(neighbour);
                    checkNeighbours(neighbour.col, neighbour.row, color);
                }
            });
        };

        checkNeighbours(col, row, color);

        return tilesToBlast;
    },

    hasPossibleMoves() {
        for (let col = 0; col < GameParameters.columns; col++) {
            for (let row = 0; row < GameParameters.rows; row++) {
                const tilesToBlast = this._getTileNeighboursOfSameColor(col, row, this._columns[col].getTileColor(row));
                if (tilesToBlast.length >= GameParameters.minTilesToBlast) {
                    return true;
                }
            }
        }

        return false;
    },

    shuffle() {
        let tiles = this._columns.flatMap(col => col.getTiles());

        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }

        console.log("tiles: ", tiles.map(tile => tile.index));

        this._columns.forEach((column, index) => {
            column.setTiles(tiles.slice(index * GameParameters.rows, (index + 1) * GameParameters.rows));            
        });
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
