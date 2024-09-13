import TileItem from './TileItem'

export default cc.Class({
    extends: cc.Component,

    properties: {
        prefabTiles: {
            default: [],
            type: [cc.Node]
        },
        _tileCount: 0 // TODO: for debug, remove before release
    },

    create() {
        const tileNode = cc.instantiate(this.prefabTiles[Math.floor(Math.random() * this.prefabTiles.length)]);
        const tileItem = tileNode.getComponent(TileItem);

        tileItem.sprite = tileNode.getComponent(cc.Sprite);
        tileItem.color = tileNode.getComponent(TileItem).color;

// TMP for debug
        this._tileCount++;
        let labelNode = new cc.Node("LabelNode");
        let labelComponent = labelNode.addComponent(cc.Label);

        labelComponent.string = this._tileCount;
        labelComponent.fontSize = 60;
        labelComponent.lineHeight = 60;
        labelComponent.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

        tileNode.addChild(labelNode);
// TODO: remove before release

        return tileNode
    },
});
