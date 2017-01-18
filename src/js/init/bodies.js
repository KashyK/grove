/* global THREE, CANNON, $, SPE */

module.exports = (globals, player) => {

    globals.scene.fog = new THREE.Fog(0xFFFFFF, 2);

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 30, 40);
    light.castShadow = true;

    light.shadowCameraNear = globals.camera.near;
    light.shadowCameraFar = globals.camera.far;
    light.shadowCameraFov = 70;
    light.shadowCameraLeft = -400;
    light.shadowCameraRight = 400;
    light.shadowCameraTop = 100;
    light.shadowCameraBottom = -300;

    light.shadowMapBias = 0.0036;
    light.shadowMapDarkness = 0.5;
    light.shadowMapWidth = 4096;
    light.shadowMapHeight = 4096;

    light.shadowCameraVisible = true;
    globals.scene.add(light);
    var spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.ImageUtils.loadTexture('/img/glow.png'),
        color: 0xffaaaa,
        transparent: false,
        blending: THREE.AdditiveBlending
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 100, 1.0);
    light.add(sprite);

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
        // var time = new Date().getTime() * 0.000015;
        var time = 2.1;
        var nsin = Math.sin(time);
        var ncos = Math.cos(time);
        // set the sun
        light.position.set(450 * nsin, 600 * nsin, 600 * ncos);

        if (nsin > 0.2) // day
        {
            sky.material.uniforms.topColor.value.setRGB(0.25, 0.55, 1);
            sky.material.uniforms.bottomColor.value.setRGB(1, 1, 1);
            var f = 1;
            light.intensity = f;
            light.shadowDarkness = f * 0.7;
            globals.scene.fog.color.set(0xCCCCCC);
        }
        else if (nsin < 0.2 && nsin > 0.0) { // twilight
            var f = nsin / 0.2;
            light.intensity = f;
            light.shadowDarkness = f * 0.7;
            sky.material.uniforms.topColor.value.setRGB(0.25 * f, 0.55 * f, 1 * f);
            sky.material.uniforms.bottomColor.value.setRGB(1 * f, 1 * f, 1 * f);
            globals.scene.fog.color.set(0xCCCCCC);
        }
        else // night
        {
            var f = 0;
            light.intensity = f;
            light.shadowDarkness = f * 0.7;
            sky.material.uniforms.topColor.value.setRGB(0, 0, 0);
            sky.material.uniforms.bottomColor.value.setRGB(0, 0, 0);
            globals.scene.fog.color.copy(uniforms.bottomColor.value);
        }

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

    // let loader = new THREE.ObjectLoader();
    // loader.load('/models/herbert/super-magic-dude.json', object => {
    //     globals.scene.add(object);
    //     // object.position.set(0, 0, 0);
    //     // object.scale.set(0.1, 0.1, 0.1);
    // });

    let loader2 = new THREE.ObjectLoader();
    loader2.load(`/models/sand/sand.json`, object => {
        globals.scene.add(object);
        object.castShadow = true;
        object.recieveShadow = true;
        object.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
                let body;
                if (!/NP/gi.test(child.name)) body = globals.load(child, {
                    mass: 0,
                    material: globals.groundMaterial
                });
                if (/portal/gi.test(child.name)) {
                    let sound = new THREE.PositionalAudio(globals.listener);
                    let oscillator = globals.listener.context.createOscillator();
                    oscillator.type = 'sine';
                    oscillator.frequency.value = 200;
                    oscillator.start();
                    sound.setNodeSource(oscillator);
                    sound.setRefDistance(20);
                    sound.setVolume(1);
                    child.add(sound);

                    child.material = new THREE.ShaderMaterial({
                        uniforms: uni,
                        vertexShader: document.getElementById('V_PortalShader').textContent,
                        fragmentShader: document.getElementById('F_PortalShader').textContent
                    });
                    child.add(new THREE.PointLight(0xFFFFFF, 1, 25, 2));
                }
                if (/bridge/gi.test(child.name)) {
                    let audioLoader = new THREE.AudioLoader();
                    let sound = new THREE.PositionalAudio(globals.listener);
                    let sound2 = new THREE.PositionalAudio(globals.listener);
                    audioLoader.load('/audio/creak.wav', (buffer) => {
                        sound.setBuffer(buffer);
                        sound.setRefDistance(5);
                        sound.setLoop(true);
                        sound.play();
                    });
                    audioLoader.load('/audio/creak2.wav', (buffer) => {
                        sound2.setBuffer(buffer);
                        sound2.setRefDistance(5);
                        sound2.setLoop(true);
                        sound2.play();
                    });
                    child.add(sound);
                    child.add(sound2);

                    let tween = new TWEEN.Tween(child.rotation)
                        .to({
                            y: -Math.PI / 8
                        }, 4000)
                        .repeat(Infinity)
                        .yoyo(true)
                        .start();

                    globals.TWEENS.push(tween);
                }
            }
        });
    });

};
