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
        }
    },

    onClick(location) {
        this.boosters.forEach(booster => {
            if (booster.checkLocationIsInBounds(location)) {
                this._toggle(booster);
                return
            };
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
        booster.select(false);
    },

    _onTileClickWithBooster(col, row, booster) {
        if (this.field.isTileMoving(col, row)) {
            return false;
        }

        switch (booster.boosterType) {
            case BoosterType.BOMB:
                const tilesToBlast = this._getTileNeighboursInRadius(col, row, GameParameters.bombRadius);
                this.field.blastTiles(tilesToBlast);
                return true;
        }
    },

    _getTileNeighboursInRadius(col, row, radius) {
        const tilesToBlast = [];

        for (let x = col - radius; x <= col + radius; x++) {
            for (let y = row - radius; y <= row + radius; y++) {
                if (x >= 0 && x < GameParameters.columns && y >= 0 && y < GameParameters.rows) {
                    tilesToBlast.push({col: x, row: y})
                }
            }
        }

        return tilesToBlast;
    },


    _toggle(booster) {
        const isSelected = booster.isSelected();
        this.boosters.forEach(booster => booster.select(false));
        booster.select(!isSelected);
    }
});
