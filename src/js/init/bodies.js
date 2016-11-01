/* global THREE, CANNON, $ */

module.exports = (globals, player) => {

    globals.scene.fog = new THREE.FogExp2(0x110011, 0.02);

    let ambient = new THREE.AmbientLight(0x111111);
    globals.scene.add(ambient);

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 30, 0);
    // light.target.position.set(0, 0, 0);
    light.castShadow = true;

    light.shadowCameraNear = globals.camera.near;
    light.shadowCameraFar = globals.camera.far;
    light.shadowCameraFov = globals.camera.fov;

    light.shadowMapBias = 0.0039;
    light.shadowMapDarkness = 0.5;
    light.shadowMapWidth = 3072;
    light.shadowMapHeight = 3072;

    light.shadowCameraVisible = false;
    globals.scene.add(light);

    // floor

    // $.getJSON('https://grove.nanoscaleapi.io/maps/hills.json', (map) => {
    //     if (map.generate) {
    //         let geometry = new THREE.PlaneGeometry(map.generate.width, map.generate.height, map.generate.wsegs, map.generate.hsegs);
    //         geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    //         for (let i = 0; i < geometry.vertices.length; i++) {
    //             geometry.vertices[i].y += (
    //                 Math[map.generate.math1](geometry.vertices[i].x) * Math[map.generate.math2](geometry.vertices[i].z)
    //             ) * map.generate.factor;
    //         }

    //         let texture = new THREE.TextureLoader().load("/img/grass.png");
    //         texture.wrapS = THREE.RepeatWrapping;
    //         texture.wrapT = THREE.RepeatWrapping;
    //         texture.repeat.set(25, 25);

    //         let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    //             color: 0xFFFFFF,
    //             shininess: 10,
    //             map: texture
    //         }));
    //         mesh.castShadow = true;
    //         mesh.receiveShadow = true;
    //         globals.scene.add(mesh);

    //         globals.load(mesh, {
    //             mass: 0,
    //             material: globals.groundMaterial
    //         });
    //     }
    // });

    let loader = new THREE.ObjectLoader();
    loader.load(`/models/${player.serverdata.acc.map}/${player.serverdata.acc.map}.json`, (object) => {
        globals.scene.add(object);
        object.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let _o = globals.load(child, {
                    mass: 0,
                    material: globals.groundMaterial
                });
                _o.body.position.z += 15;
                _o.mesh.position.z += 15;
            }
        });
    });

};
