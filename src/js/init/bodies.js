/* global THREE, CANNON, $, SPE */

module.exports = (globals, player) => {

    globals.scene.fog = new THREE.FogExp2(0xFFFFFF, 0.02);

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 30, 40);
    light.castShadow = true;

    light.shadowCameraNear = globals.camera.near;
    light.shadowCameraFar = globals.camera.far;
    light.shadowCameraFov = 70;
    light.shadowCameraLeft = -100;
    light.shadowCameraRight = 100;
    light.shadowCameraTop = 100;
    light.shadowCameraBottom = -100;

    light.shadowMapBias = 0.0039;
    light.shadowMapDarkness = 0.5;
    light.shadowMapWidth = 3072;
    light.shadowMapHeight = 3072;

    light.shadowCameraVisible = true;
    globals.scene.add(light);
    light.add(new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshBasicMaterial({
        color: 0xFF0000
    })));

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
        var time = new Date().getTime() * 0.000015;
        // var time = 2.1;
        var nsin = Math.sin(time);
        var ncos = Math.cos(time);
        // set the sun
        light.position.set(150 * nsin, 200 * nsin, 200 * ncos);

        if (nsin > 0.2) // day
        {
            sky.material.uniforms.topColor.value.setRGB(0.25, 0.55, 1);
            sky.material.uniforms.bottomColor.value.setRGB(1, 1, 1);
            var f = 1;
            light.intensity = f;
            light.shadowDarkness = f * 0.7;
        }
        else if (nsin < 0.2 && nsin > 0.0) {
            var f = nsin / 0.2;
            light.intensity = f;
            light.shadowDarkness = f * 0.7;
            sky.material.uniforms.topColor.value.setRGB(0.25 * f, 0.55 * f, 1 * f);
            sky.material.uniforms.bottomColor.value.setRGB(1 * f, 1 * f, 1 * f);
        }
        else // night
        {
            var f = 0;
            light.intensity = f;
            light.shadowDarkness = f * 0.7;
            sky.material.uniforms.topColor.value.setRGB(0, 0, 0);
            sky.material.uniforms.bottomColor.value.setRGB(0, 0, 0);
        }

        globals.scene.fog.color.copy(uniforms.bottomColor.value);

    }, 40);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    globals.scene.add(hemiLight);


    var vertexShader = document.getElementById('V_SkyShader').textContent;
    var fragmentShader = document.getElementById('F_SkyShader').textContent;
    var uniforms = {
        topColor: {
            type: "c",
            value: new THREE.Color(0x0077ff)
        },
        bottomColor: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        offset: {
            type: "f",
            value: 33
        },
        exponent: {
            type: "f",
            value: 0.6
        }
    };
    uniforms.topColor.value.copy(hemiLight.color);
    globals.scene.fog.color.copy(uniforms.bottomColor.value);
    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.BackSide
    });
    var sky = new THREE.Mesh(skyGeo, skyMat);
    globals.BODIES['player'].mesh.add(sky);

    let loader = new THREE.ObjectLoader();
    loader.load(`/models/map/a-map.json`, object => {
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
                if (child.name == 'B_Portal') {
                    child.material = new THREE.ShaderMaterial({
                        uniforms: uni,
                        vertexShader: document.getElementById('V_PortalShader').textContent,
                        fragmentShader: document.getElementById('F_PortalShader').textContent
                    });
                    child.add(new THREE.PointLight(0xFFFFFF, 1, 25, 2));
                }
            }
        });
    });
    // let loader2 = new THREE.ObjectLoader();
    // loader2.load(`/models/alchemy-table/alchemy-table.json`, (object) => {
    //     globals.scene.add(object);
    //     let torch = new THREE.PointLight(0x00FF00, 0.15);
    //     torch.position.set(0, 10, 10);
    //     globals.scene.add(torch);
    //     object.traverse(child => {
    //         if (child instanceof THREE.Mesh) {
    //             let _o = globals.load(child, {
    //                 mass: 0,
    //                 material: globals.groundMaterial
    //             });
    //             _o.mesh.position.y += 8.7;
    //             _o.mesh.position.z += 20;
    //             _o.body.position.y += 8.7;
    //             _o.body.position.z += 20;
    //         }
    //     });
    // });

};
