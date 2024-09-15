import GameParameters from './GameParameters';
import FieldColumn from './FieldColumn';
import ScoreManager from './ScoreManager';

export default cc.Class({
    extends: cc.Component,

    properties: {
        columnPrefab: {
            default: null,
            type: cc.Node
        },
        _columns: {
            default: [],
            type: [FieldColumn]
        }
    },

    onLoad() {
        this.node.width = GameParameters.columns * GameParameters.tileSize.width;
		this.node.height = GameParameters.rows * GameParameters.tileSize.height;
		this.node.setPosition (-this.node.width / 2, -this.node.height / 2);

        while (this._columns.length < GameParameters.columns) {
            const column = cc.instantiate(this.columnPrefab);
            column.parent = this.node;
            this._columns.push(column.getComponent(FieldColumn));
        }
        
        this._columns.forEach(col => col.startColumn());
        this._positionColumns();
    },

    getTileIndicesFromCoords(location) {
        const localLocation = this.node.convertToNodeSpaceAR(location);

        const col = Math.floor(localLocation.x / GameParameters.tileSize.width);
        const row = Math.floor(localLocation.y / GameParameters.tileSize.height);

        return { col: col, row: row };
    },

    getTileColor(col, row) {
        return this._columns[col].getTileColor(row);
    },

    hasMovingTiles() {
        for (let col = 0; col < GameParameters.columns; col++) {
            for (let row = 0; row < GameParameters.rows; row++) {
                if (this.isTileMoving(column, row)) {
                    return true;
                }
            }
        }

        return false;
    },

    isTileMoving(col, row) {
        return this._columns[col].isTileMoving(row);
    },

    getTiles() {
        return this._columns.flatMap(col => col.getTiles());
    },

    setTiles(tiles) {
        this._columns.forEach((column, index) => {
            column.setTiles(tiles.slice(index * GameParameters.rows, (index + 1) * GameParameters.rows));            
        });
    },

    blastTiles(tilesToBlast) {
        this._columns.forEach((column, index) => {
            const columnTilesToBlast = tilesToBlast.filter((tile) => tile.col == index);
            if (columnTilesToBlast.length > 0) {
                column.blast(columnTilesToBlast.map(tile => tile.row));
            }
        });
    },

    _positionColumns() {
        this._columns.forEach((col, index) => {
            col.node.setPosition(index * GameParameters.tileSize.width, 0);
        })
    },
});
