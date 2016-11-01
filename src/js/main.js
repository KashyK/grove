/* global $ */

let globals = require('./globals');
let player = require('./player');

const dt = 1 / 60;

// require('./load')(globals);
require('./shooting')(globals);
require('./multiplayer')(globals, player);

THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
    alert(`${loaded} out of ${total}`);
    if (loaded == total) {
        animate();
    }
};

function animate(delta) {

    requestAnimationFrame(animate);

    globals.camera.updateMatrixWorld(); // make sure the camera matrix is updated
    globals.camera.matrixWorldInverse.getInverse(globals.camera.matrixWorld);
    globals.cameraViewProjectionMatrix.multiplyMatrices(globals.camera.projectionMatrix, globals.camera.matrixWorldInverse);
    globals.frustum.setFromMatrix(globals.cameraViewProjectionMatrix);

    if (globals.remove.bodies.length && globals.remove.meshes.length) {
        for (let key in globals.remove.bodies) {
            globals.world.remove(globals.remove.bodies[key]);
            delete globals.remove.bodies[key];
        }
        for (let key in globals.remove.meshes) {
            globals.scene.remove(globals.remove.meshes[key]);
            delete globals.remove.meshes[key];
        }
    }

    // Update bullets, etc.
    for (let i = 0; i < globals.BODIES['projectiles'].length; i++) {
        globals.BODIES['projectiles'][i].mesh.position.copy(globals.BODIES['projectiles'][i].body.position);
        globals.BODIES['projectiles'][i].mesh.quaternion.copy(globals.BODIES['projectiles'][i].body.quaternion);
    }

    // Update items
    for (let i = 0; i < globals.BODIES['items'].length; i++) {
        globals.BODIES['items'][i].mesh.position.copy(globals.BODIES['items'][i].body.position);
        globals.BODIES['items'][i].mesh.quaternion.copy(globals.BODIES['items'][i].body.quaternion);
    }

    // Update labels
    for (let key in globals.LABELS) globals.LABELS[key]();

    globals.BODIES['player'].mesh.position.copy(globals.BODIES['player'].body.position);
    if (globals.BODIES['player'].body.velocity.x > 10) globals.BODIES['player'].body.velocity.x = 10;
    if (globals.BODIES['player'].body.velocity.z > 10) globals.BODIES['player'].body.velocity.z = 10;

    $('#health-bar')
        .val(player.hp.val / player.hp.max * 100 > 0 ? player.hp.val / player.hp.max * 100 : 0);
    $('#health').text(player.hp.val > 0 ? player.hp.val : 0 + ' HP');

    globals.world.step(dt);
    globals.controls.update(Date.now() - globals.delta);
    globals.rendererDEBUG.update();
    globals.renderer.render(globals.scene, globals.camera);
    globals.delta = Date.now();

    if (player && player.serverdata && globals && globals.updatePlayerData) {
        globals.updatePlayerData();
        globals.socket.emit('updatePosition', player.serverdata);
    }

}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    globals.camera.aspect = window.innerWidth / window.innerHeight;
    globals.camera.updateProjectionMatrix();

    globals.renderer.setSize(window.innerWidth, window.innerHeight);

}
