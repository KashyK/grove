/* global THREE, CANNON */

module.exports = {
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({
        antialias: true
    }),
    camera: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000),

    world: new CANNON.World(),
    
    BODIES: {
        items: [],
        projectiles: []
    },
    LABELS: [],
    PLAYERS: [],
    remove: {
        bodies: [],
        meshes: []
    },

    delta: Date.now(),
    frustum: new THREE.Frustum(),
    cameraViewProjectionMatrix: new THREE.Matrix4(),
};

module.exports.rendererDEBUG = new THREE.CannonDebugRenderer(module.exports.scene, module.exports.world);