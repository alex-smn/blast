import GameParameters from './GameParameters';
import FieldColumn from './FieldColumn';

export default cc.Class({
    extends: cc.Component,

    properties: {
        _columns: {
            default: [],
            type: [FieldColumn]
        },
        columnPrefab: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        while (this._columns.length < GameParameters.columns) {
            const column = cc.instantiate(this.columnPrefab);
            column.parent = this.node;
            this._columns.push(column.getComponent(FieldColumn));
        }
    },

    startField() {
        this._columns.forEach(col => col.startColumn());
        this._positionColumns();
    },

    _positionColumns() {
        this._columns.forEach((col, index) => {
            col.node.setPosition(index * GameParameters.tileSize.width, 0); // TODO: change from const
        })
    },

    onClick(x, y) {
        const col = Math.floor(x / GameParameters.tileSize.width);
        const row = Math.floor(y / GameParameters.tileSize.height);

        if (col >= 0 && col < GameParameters.columns && row >= 0 && row < GameParameters.rows) {
            this._onTileClick(col, row);
        }
    },

    _onTileClick(col, row) {
        const color = this._columns[col].getTileColor(row);
        
        const tilesToBlast = this._checkForBlast(col, row, color);
        tilesToBlast.forEach(element => {
            this._columns[element.col].blast(element.row);
        });
    },

    _checkForBlast(col, row, color) {
        const tilesToBlast = [{col: col, row: row}];

        const checkNeighbours = (col, row, color) => {
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

            neighbours.forEach(neighbour => {
                const exists = tilesToBlast.some(tile => tile.col === neighbour.col && tile.row === neighbour.row);
                if (this._columns[neighbour.col].getTileColor(neighbour.row) === color && !exists) {
                    tilesToBlast.push(neighbour);
                    checkNeighbours(neighbour.col, neighbour.row, color);
                }
            });
        };

        checkNeighbours(col, row, color);
        console.dir(tilesToBlast);

        return tilesToBlast.length >= GameParameters.minTilesToBlast ? tilesToBlast : [];
    }
});
