import Tile from './Tile'

export const SupertileType = Object.freeze({
    HORIZONTAL: 0,
    VERTICAL: 1,
    BOMB: 2,
    MEGABOMB: 3
})

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

    blast() {
        this.node.destroy();
        const position = new cc.Vec3(this.node.width / 2, this.node.height / 2);

        const globalPosition = this.node.convertToWorldSpaceAR(position);

        this.effectsManager.animateBlast(globalPosition, cc.Color.RED);
    },
});
