import Tile from './Tile'

export default cc.Class({
    extends: cc.Component,

    properties: {
        prefabTiles: {
            default: [],
            type: [cc.Node]
        },
        tileCounter: 0
    },

    create() {
        const tileNode = cc.instantiate(this.prefabTiles[Math.floor(Math.random() * this.prefabTiles.length)]);
        const tile = tileNode.getComponent(Tile);

        tile.sprite = tileNode.getComponent(cc.Sprite);
        tile.color = tileNode.getComponent(Tile).color;
        tile.index = this.tileCounter;

        // TMP for debug
        // let labelNode = new cc.Node("LabelNode");
        // let labelComponent = labelNode.addComponent(cc.Label);
        // labelNode.setPosition(30, 30);
        // labelComponent.string = this.tileCounter;
        // labelComponent.fontSize = 60;
        // labelComponent.lineHeight = 60;
        // labelComponent.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        // tileNode.addChild(labelNode);

        this.tileCounter++;
        
        return tileNode
    },
});
