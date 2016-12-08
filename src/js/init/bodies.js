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

    let uni = {
        time: {
            value: 1.0
        },
        resolution: {
            value: new THREE.Vector2()
        }
    };

    setInterval(() => {
        uni.time.value += 0.1;
    }, 40);

    let box = globals.box({
        l: 2,
        h: 3,
        w: 0.01,
        mat: new THREE.ShaderMaterial({
            uniforms: uni,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('portalShader').textContent
        })
    });
    box.body.position.set(0, 11, 8);

    var imagePrefix = "img/skybox/";
    var directions = ["px", "nx", "py", "ny", "pz", "nz"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.CubeGeometry(500, 500, 500);

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide,
            fog: false
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    globals.BODIES['player'].mesh.add(skyBox);

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
