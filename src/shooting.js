/* global THREE, CANNON, socket */

module.exports = (globals) => {

    function getShootDir(targetVec) {
        let projector = new THREE.Projector();
        let vector = targetVec;
        targetVec.set(0, 0, 1);
        projector.unprojectVector(vector, globals.camera);
        let ray = new THREE.Ray(globals.BODIES['player'].body.position, vector.sub(globals.BODIES['player'].body.position).normalize());
        targetVec.copy(ray.direction);
    }

    window.addEventListener("click", (e) => {
        if (globals.controls.enabled == true) {

            let shootDirection = new THREE.Vector3();
            const shootVelo = 15;

            let x = globals.BODIES['player'].body.position.x;
            let y = globals.BODIES['player'].body.position.y;
            let z = globals.BODIES['player'].body.position.z;

            let ball = globals.load.ball({
                array: 'projectiles'
            });

            getShootDir(shootDirection);
            ball.body.velocity.set(shootDirection.x * shootVelo,
                shootDirection.y * shootVelo,
                shootDirection.z * shootVelo);

            // Move the ball outside the player sphere
            x += shootDirection.x * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
            y += shootDirection.y * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
            z += shootDirection.z * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
            ball.body.position.set(x, y, z);
            ball.mesh.position.set(x, y, z);
            
            socket.emit('bullet', {
                x,
                y,
                z
            });
        }
    });
};