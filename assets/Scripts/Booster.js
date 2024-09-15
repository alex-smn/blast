export const BoosterType = Object.freeze({
	BOMB: 0,
	TELEPORT: 1
})

export const BoosterPrice = Object.freeze({
    BOMB: 1000,
    TELEPORT: 500
})

export default cc.Class({
    extends: cc.Component,

    properties: {
        boosterType: BoosterType.BOMB,
        _price: 0,
        frame: {
            default: null,
            type: cc.Sprite
        },
        priceLabel: {
            default: null,
            type: cc.Label
        },
        _isEnabled: false,
        _isSelected: false
    },

    onLoad() {
        switch (this.boosterType) {
            case BoosterType.BOMB:
                this._price = BoosterPrice.BOMB;
                break;
            case BoosterType.TELEPORT:
                this._price = BoosterPrice.TELEPORT;
                break;
        }

        this.priceLabel.string = this._price;
    },

    checkLocationIsInBounds(location) {
        const localLocation = this.node.convertToNodeSpaceAR(location);
        if (
            localLocation.x > -this.node.width / 2 && localLocation.x < this.node.width / 2
            && localLocation.y > -this.node.height / 2 && localLocation.y < this.node.height / 2
        ) {
            return true;
        }

        return false;
    },

    select(newState) {
        if (newState != this._isSelected) {
            this._isSelected = newState;
            this.frame.node.active = newState;
        }
    },

    setIsEnabled(newState) {
        this.node.opacity = newState == true ? 255 : 150;
        this.node.isEnabled = newState;
    },

    isSelected() {
        return this._isSelected;
    },

    getPrice() {
        return this._price;
    }
});
