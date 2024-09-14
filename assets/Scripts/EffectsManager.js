export default cc.Class({
    extends: cc.Component,

    properties: {
        prefabParticleSystem: {
            default: null,
            type: cc.Node
        }
    },

    animateBlast(position, color) {
        const particleSystemNode = cc.instantiate(this.prefabParticleSystem);
        particleSystemNode.parent = this.node;
        
        const particleSystem = particleSystemNode.getComponent(cc.ParticleSystem);

        particleSystem.startColor = color;
        particleSystem.endColor = color;
        particleSystem.endColor.a = 0;

        const localPosition = this.node.convertToNodeSpaceAR(position);

        particleSystemNode.setPosition(localPosition);
    }
});
