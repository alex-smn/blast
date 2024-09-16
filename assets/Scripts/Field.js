import GameParameters from './GameParameters';
import FieldColumn from './FieldColumn';

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
        this.node.setPosition(-this.node.width / 2, -this.node.height / 2);

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

        if (col >= 0 && col < GameParameters.columns && row >= 0 && row < GameParameters.rows) {
            return { col: col, row: row };
        }

        return null;
    },

    getTileColor(col, row) {
        return this._columns[col].getTileColor(row);
    },

    getSupertileType(col, row) {
        return this._columns[col].getSupertileType(row);
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

    blastTilesCreatingSupertile(tilesToBlast, col, row, supertileType) {
        this._columns.forEach((column, index) => {
            const columnTilesToBlast = tilesToBlast.filter((tile) => tile.col == index);

            if (columnTilesToBlast.length > 0) {
                if (index == col) {
                    const tileRows = columnTilesToBlast.map(tile => tile.row);
                    column.blastCreatingSupertile(tileRows, Math.min(...tileRows), supertileType);
                } else {
                    column.blast(columnTilesToBlast.map(tile => tile.row));
                }
            }
        });
    },

    setTileSelected(col, row, isSelected) {
        this._columns[col].setTileSelected(row, isSelected);
    },

    swapTiles(coord1, coord2) {
        if (coord1.col == coord2.col) {
            const tiles = this._columns[coord1.col].getTiles();

            [tiles[coord1.row], tiles[coord2.row]] = [tiles[coord2.row], tiles[coord1.row]];

            this._columns[coord1.col].setTiles(tiles);
        } else {
            const tiles1 = this._columns[coord1.col].getTiles();
            const tiles2 = this._columns[coord2.col].getTiles();

            [tiles1[coord1.row], tiles2[coord2.row]] = [tiles2[coord2.row], tiles1[coord1.row]];

            this._columns[coord1.col].setTiles(tiles1);
            this._columns[coord2.col].setTiles(tiles2);
        }
    },

    _positionColumns() {
        this._columns.forEach((col, index) => {
            col.node.setPosition(index * GameParameters.tileSize.width, 0);
        });
    },
});
