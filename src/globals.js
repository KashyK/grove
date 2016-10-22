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

    groundMaterial: new CANNON.Material("groundMaterial")
};

module.exports.rendererDEBUG = new THREE.CannonDebugRenderer(module.exports.scene, module.exports.world);
// Adjust constraint equation parameters for ground/ground contact
var ground_ground_cm = new CANNON.ContactMaterial(module.exports.groundMaterial, module.exports.groundMaterial, {
    friction: 1e60,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
});

// Add contact material to the world
module.exports.world.addContactMaterial(ground_ground_cm);