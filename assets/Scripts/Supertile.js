import Tile from './Tile';

export const SupertileType = Object.freeze({
    HORIZONTAL: 0,
    VERTICAL: 1,
    BOMB: 2,
    MEGABOMB: 3
});

export const SupertilesThreshold = {
    HORIZONTAL: 4,
    VERTICAL: 5,
    BOMB: 6,
    MEGABOMB: 7
};

export default cc.Class({
    extends: Tile,

    properties: {
        supertileType: SupertileType.HORIZONTAL
    },
});
