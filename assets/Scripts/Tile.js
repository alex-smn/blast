import GameParameters from './GameParameters';
import EffectsManager from './EffectsManager';
const {ccclass, property} = cc._decorator;

const MoveState = Object.freeze({
	MOVING: 0,
	BOUNCING_START: 1,
	BOUNCING_FINISH: 2,
	IDLE: 3
})

export default cc.Class({
    extends: cc.Component,

    properties: {
    	sprite: {
    		default: null,
            type: cc.Sprite
    	},
    	color: cc.Color.TRANSPARENT,
    	effectsManager: {
			default: null,
			type: EffectsManager
		},
		moveDelay: 0,
		index: -1,
		_targetPosition: new cc.Vec3(-1, -1),
		_moveState: MoveState.IDLE
    },

    _moveToTargetPos(dt) {	
		const distance = this._targetPosition.sub(this.node.position);
		
		let frameDistance = GameParameters.tileMoveSpeed * dt;

		if (this._moveState != MoveState.MOVING) {
			frameDistance *= GameParameters.bounceSpeedRatio;
		}

		const normalizedDistance = distance.normalize();
		const deltaPos = normalizedDistance.mul(frameDistance);

		if (frameDistance < distance.len()) {
			this.node.setPosition(this.node.position.add(deltaPos));
		} else {
			this.node.setPosition(this._targetPosition);
			switch (this._moveState) {
				case MoveState.IDLE:
					break;
				case MoveState.MOVING:
					this._moveState = MoveState.IDLE;
					// this._targetPosition.subSelf(normalizedDistance.mul(GameParameters.tileSize.height * 0.25));

					break;
				case MoveState.BOUNCING_START:
					this._moveState = MoveState.BOUNCING_FINISH;
					this._targetPosition.subSelf(normalizedDistance.mul(GameParameters.tileSize.height * 0.25));

					break;
				case MoveState.BOUNCING_FINISH:
					this._moveState = MoveState.IDLE;
					break;
			}
		}
	},

    update(dt) {
		if (this.moveDelay > 0) {
			this.moveDelay -= dt;
		} else if (this._moveState != MoveState.IDLE) {
    		this._moveToTargetPos(dt);
    	}
    },

	moveTo(position) {
		const isSameTarget = this._targetPosition.fuzzyEquals(position, 0.1);
		const isSamePosition = this.node.position.fuzzyEquals(position, 0.1);

		if (!isSameTarget || (!isSamePosition && this._moveState == MoveState.IDLE)) {
			this._targetPosition = position;
			this._moveState = MoveState.MOVING;
		}
	},

	blast() {
		this.node.destroy();
		const position = new cc.Vec3(this.node.width / 2, this.node.height / 2);

		const globalPosition = this.node.convertToWorldSpaceAR(position);

		this.effectsManager.animateBlast(globalPosition, this.color);
	},

	setInfo(info) {
		tile.sprite = tileNode.getComponent(cc.Sprite);
        tile.color = tileNode.getComponent(Tile).color;
        
	},

	isTileMoving() {
		return this._moveState != MoveState.IDLE;
	}
});
