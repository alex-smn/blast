import TileItem from './TileItem'

export default cc.Class({
    extends: cc.Component,

    properties: {
        prefabTiles: {
            default: [],
            type: [cc.Node]
        }
    },

    create() {
        const tileNode = cc.instantiate(this.prefabTiles[Math.floor(Math.random() * this.prefabTiles.length)]);
        const tileItem = tileNode.getComponent(TileItem);

        tileItem.sprite = tileNode.getComponent(cc.Sprite);
        tileItem.color = tileNode.getComponent(TileItem).color;
        
        return tileNode
    },
});
