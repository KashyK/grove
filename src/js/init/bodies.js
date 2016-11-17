/* global THREE, CANNON, $ */

module.exports = (globals, player) => {

    globals.scene.fog = new THREE.FogExp2(0x2080B6, 0.02);

    let ambient = new THREE.AmbientLight(0x111111);
    globals.scene.add(ambient);

    let light = new THREE.SpotLight(0xffffff, 2);
    light.position.set(30, 10, 30);
    light.castShadow = true;

    light.shadowCameraNear = globals.camera.near;
    light.shadowCameraFar = globals.camera.far;
    light.shadowCameraFov = globals.camera.fov;

    light.shadowMapBias = 0.0039;
    light.shadowMapDarkness = 0.5;
    light.shadowMapWidth = 3072;
    light.shadowMapHeight = 3072;

    light.shadowCameraVisible = true;
    globals.scene.add(light);

    globals.scene.add(new THREE.AmbientLight(0x333333));

    let loader = new THREE.ObjectLoader();
    loader.load(`/models/${player.serverdata.acc.map}/${player.serverdata.acc.map}.json`, (object) => {
        globals.scene.add(object);
        object.castShadow = true;
        object.recieveShadow = true;
        object.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
                let _o = globals.load(child, {
                    mass: 0,
                    material: globals.groundMaterial
                });
            }
        });
    });
    let loader2 = new THREE.ObjectLoader();
    loader2.load(`/models/alchemy-table/alchemy-table.json`, (object) => {
        globals.scene.add(object);
        let torch = new THREE.PointLight(0x00FF00, 0.15);
        torch.position.set(0, 10, 10);
        globals.scene.add(torch);
        object.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let _o = globals.load(child, {
                    mass: 0,
                    material: globals.groundMaterial
                });
                _o.mesh.position.y += 8.7;
                _o.mesh.position.z += 20;
                _o.body.position.y += 8.7;
                _o.body.position.z += 20;
            }
        });
    });

};
