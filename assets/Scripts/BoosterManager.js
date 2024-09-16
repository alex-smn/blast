import GameParameters from './GameParameters';
import Booster from "./Booster";
import Field from "./Field";
import { BoosterType } from './Booster';

export default cc.Class({
    extends: cc.Component,

    properties: {
        boosters: {
            default: [],
            type: [Booster]
        },
        field: {
            default: null,
            type: Field
        },
        _teleportTileLocation: {
            default: null,
            type: Object
        }
    },

    onClick(location) {
        this.boosters.forEach(booster => {
            if (booster.checkLocationIsInBounds(location)) {
                this._toggle(booster);

                return;
            }
        });
    },

    performBooster(location) {
        const selectedBooster = this.getSelectedBooster();
        const indices = this.field.getTileIndicesFromCoords(location);

        if (indices) {
            const isPerformed = this._onTileClickWithBooster(indices.col, indices.row, selectedBooster);

            if (isPerformed) {
                this.deselectBooster(selectedBooster);
            }

            return isPerformed;
        }

        return false;
    },

    getSelectedBooster() {
        return this.boosters.find(booster => booster.isSelected());
    },

    deselectBooster(booster) {
        this._resetBoosters();
        booster.select(false);
    },

    _onTileClickWithBooster(col, row, booster) {
        if (this.field.isTileMoving(col, row)) {
            return false;
        }

        switch (booster.boosterType) {
            case BoosterType.BOMB:
                return this._performBomb(col, row);
            case BoosterType.TELEPORT:
                return this._performTeleport(col, row);
        }
    },

    _performBomb(col, row) {
        const tilesToBlast = this._getTileNeighboursInRadius(col, row, GameParameters.bombRadius);
        this.field.blastTiles(tilesToBlast);

        return true;
    },

    _performTeleport(col, row) {
        if (this._teleportTileLocation != null) {
            this.field.setTileSelected(this._teleportTileLocation.col, this._teleportTileLocation.row, false);
            this.field.swapTiles({col: col, row: row}, {col: this._teleportTileLocation.col, row: this._teleportTileLocation.row});
            this._teleportTileLocation = null;

            return true;
        } else {
            this._teleportTileLocation = {col: col, row: row};
            this.field.setTileSelected(col, row, true);

            return false;
        }
    },

    _getTileNeighboursInRadius(col, row, radius) {
        const tiles = [];

        for (let x = col - radius; x <= col + radius; x++) {
            for (let y = row - radius; y <= row + radius; y++) {
                if (x >= 0 && x < GameParameters.columns && y >= 0 && y < GameParameters.rows) {
                    tiles.push({col: x, row: y});
                }
            }
        }

        return tiles;
    },


    _toggle(booster) {
        this._resetBoosters();
        
        const isSelected = booster.isSelected();
        this.boosters.forEach(booster => booster.select(false));
        booster.select(!isSelected);
    },

    _resetBoosters() {
        if (this._teleportTileLocation != null) {
            this.field.setTileSelected(this._teleportTileLocation.col, this._teleportTileLocation.row, false);
            this._teleportTileLocation = null;
        }
    }
});
