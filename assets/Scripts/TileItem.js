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
		_targetPos: -1,
		_moveState: MoveState.IDLE
    },

    _moveToTargetPos(dt) {
    	let deltaPos = 0;
    	if (this.node.position.y > this._targetPos) {
    		deltaPos = -GameParameters.tileMoveSpeed * dt;
    	} else {
    		deltaPos = GameParameters.tileMoveSpeed * dt;
    	}

		if (this._moveState != MoveState.MOVING) {
			deltaPos *= GameParameters.bounceSpeedRatio;
		}

		if (Math.abs(deltaPos) < Math.abs(this.node.position.y - this._targetPos)) {
			this.node.setPosition(0, this.node.position.y + deltaPos);
		} else {
			this.node.setPosition(0, this._targetPos);
			switch (this._moveState) {
				case MoveState.IDLE:
					break;
				case MoveState.MOVING:
					this._moveState = MoveState.BOUNCING_START;

					if (deltaPos < 0) {
						this._targetPos += GameParameters.tileSize.height * 0.25;
					} else {
						this._targetPos -= GameParameters.tileSize.height * 0.25;
					}
					break;
				case MoveState.BOUNCING_START:
					this._moveState = MoveState.BOUNCING_FINISH;

					if (deltaPos < 0) {
						this._targetPos += GameParameters.tileSize.height * 0.25;
					} else {
						this._targetPos -= GameParameters.tileSize.height * 0.25;
					}
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

	moveTo(pos) {
		if (this._targetPos != pos) {
			this._targetPos = pos;
			this._moveState = MoveState.MOVING;
		}
	},

	blast() {
		this.node.destroy();
		const position = new cc.v2(this.node.width / 2, this.node.height / 2);

		const globalPosition = this.node.convertToWorldSpaceAR(position);
		// console.log(this.node.getPosition());

		this.effectsManager.animateBlast(globalPosition, this.color);
	}
});
