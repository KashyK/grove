(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AIS = [];

var AI = function () {
    function AI() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '{{ AI CONSTRUCTOR }}';
        var hp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var dmg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

        _classCallCheck(this, AI);

        this.name = name;
        this.hp = hp;
        this.dmg = dmg;
        this.target = null;

        this.shape = new THREE.Mesh(new THREE.BoxGeometry(5, 40, 5), new THREE.MeshLambertMaterial({
            color: 0xFFFFFF
        }));
        AIS.push(this);
    }

    _createClass(AI, [{
        key: 'update',
        value: function update() {
            for (var key in AIS) {
                key;
            }
        }
    }]);

    return AI;
}();

module.exports.ai = AI;

var dave = new AI();

},{}],2:[function(require,module,exports){
'use strict';

/* global THREE, CANNON, io */

require('./items');

module.exports = {
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: true
    }),
    camera: new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20000),

    world: new CANNON.World(),

    socket: io(),

    composers: [],

    BODIES: {
        items: [],
        projectiles: []
    },
    LABELS: [],
    PLAYERS: [],
    EMITTERS: [],
    TWEENS: [],
    remove: {
        bodies: [],
        meshes: [],
        tweens: []
    },

    listener: new THREE.AudioListener(),

    delta: Date.now(),
    clock: new THREE.Clock(),
    frustum: new THREE.Frustum(),
    cameraViewProjectionMatrix: new THREE.Matrix4(),

    groundMaterial: new CANNON.Material("groundMaterial")
};

// module.exports.rendererDEBUG = new THREE.CannonDebugRenderer(module.exports.scene, module.exports.world);
// Adjust constraint equation parameters for ground/ground contact
var ground_ground_cm = new CANNON.ContactMaterial(module.exports.groundMaterial, module.exports.groundMaterial, {
    friction: 50,
    restitution: 0.3
});

// Add contact material to the world
module.exports.world.addContactMaterial(ground_ground_cm);

var load = require('./load');
module.exports.load = load.load;
module.exports.box = load.box;
module.exports.label = load.label;
module.exports.ball = load.ball;
module.exports.plane = load.plane;

},{"./items":8,"./load":12}],3:[function(require,module,exports){
'use strict';

/* global $ */

module.exports = function (title, content) {
    $('#quest-alert').css('right', '0px');
    $('#quest-alert > p').text(title);
    $('#quest-alert > small').text(content);
    setTimeout(function () {
        $('#quest-alert').animate({
            'right': '-280px'
        }, 1000);
    }, 5000);
};

module.exports.init = function () {
    $('#gui').toggle();
    $('#underlay').toggle();
    $('#load-play-btn').hide();
    $('#gui-exit').click(function () {
        $('#gui').toggle();
        $('#underlay').toggle();
    });
};

module.exports.quests = function () {
    $('#quest-alert > p').text('Getting Skills');
    $('#quest-alert > small').text('Use the Alchemy Table to make a health potion.');
    setTimeout(function () {
        $('#quest-alert').animate({
            'right': '-280px'
        }, 1000);
    }, 10000);
};

module.exports.hotbar = function (player) {
    for (var i = 0; i < 8; i++) {
        $('#hb-' + i).html('-');
    }for (var _i = 0; _i < player.hotbar.length; _i++) {
        $('#hb-' + (_i + 1)).text(player.hotbar[_i].name).data('item', player.hotbar[_i]);
    }
};

module.exports.stats = function (player) {

    $('#gui').show();
    $('#underlay').show();
    $('#gui-title').text('');
    $('#gui-content').html('<h1 style=margin-top:21.5%;text-align:center;width:90%;color:white>\n    <span id=gui-q>quests</span> | <span id=gui-i>inventory</span> | <span id=gui-m>map</span> | <span id=gui-p>player</span>\n    </h1>');

    //

    $('#gui-q').click(function () {
        $('#gui-title').html('Quests');
        $('#gui-content').html('questy stuff');
    });
    $('#gui-i').click(function () {
        $('#gui-title').html('Inventory');
        $('#gui-content').html('');

        var _loop = function _loop(key) {
            $(document.createElement('span')).html(player.inventory[key].name).click(function (e) {
                if (player.hotbar.indexOf(player.inventory[key]) == -1) {
                    player.hotbar.push(player.inventory[key]);
                    module.exports.hotbar(player);
                    $(e.target).css('background-color', 'blue');
                } else {
                    player.hotbar.splice(player.hotbar.indexOf(player.inventory[key]), 1);
                    module.exports.hotbar(player);
                    $(e.target).css('background-color', 'transparent');
                }
            }).css('background-color', player.hotbar.indexOf(player.inventory[key]) == 0 ? 'blue' : 'transparent').appendTo($('#gui-content'));
        };

        for (var key in player.inventory) {
            _loop(key);
        }
    });
    $('#gui-m').click(function () {
        $('#gui-title').html('Map');
        var strMime = "image/jpeg";
        var imgData = require('./globals').renderer.domElement.toDataURL(strMime);
        $('#gui-content').html('<img src=' + imgData + ' width=200>');
    });
    $('#gui-p').click(function () {
        $('#gui-title').html('Player');
        $('#gui-content').html('ur stats');
    });
    if ($('#gui-content').is(':visible')) document.exitPointerLock();
};

},{"./globals":2}],4:[function(require,module,exports){
"use strict";

/* global THREE, CANNON, $, SPE */

module.exports = function (globals, player) {

    globals.scene.fog = new THREE.Fog(0xFFFFFF, 2);

    var light = new THREE.DirectionalLight(0xffffff, 1);
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

    var uni = {
        time: {
            value: 1.0
        },
        resolution: {
            value: new THREE.Vector2()
        }
    };

    setInterval(function () {
        uni.time.value += 0.1;
        // var time = new Date().getTime() * 0.000015;
        var time = 2.1;
        var nsin = Math.sin(time);
        var ncos = Math.cos(time);
        // set the sun
        light.position.set(450 * nsin, 600 * nsin, 600 * ncos);
    }, 40);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    globals.scene.add(hemiLight);

    var imagePrefix = "/img/skybox/";
    var directions = ["px", "nx", "py", "ny", "pz", "nz"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.CubeGeometry(2000, 2000, 2000);

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide,
            fog: false
        }));
    }var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    globals.BODIES['player'].mesh.add(skyBox);

    // let loader = new THREE.ObjectLoader();
    // loader.load('/models/herbert/super-magic-dude.json', object => {
    //     globals.scene.add(object);
    //     // object.position.set(0, 0, 0);
    //     // object.scale.set(0.1, 0.1, 0.1);
    // });

    var loader2 = new THREE.ObjectLoader();
    loader2.load("/models/skjar-isles/skjar-isles.json", function (object) {
        globals.scene.add(object);
        object.castShadow = true;
        object.recieveShadow = true;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
                var body = void 0;
                if (!/NP/gi.test(child.name)) body = globals.load(child, {
                    mass: 0,
                    material: globals.groundMaterial
                });
                if (/portal/gi.test(child.name)) {
                    // let sound = new THREE.PositionalAudio(globals.listener);
                    // let oscillator = globals.listener.context.createOscillator();
                    // oscillator.type = 'sine';
                    // oscillator.frequency.value = 200;
                    // oscillator.start();
                    // sound.setNodeSource(oscillator);
                    // sound.setRefDistance(20);
                    // sound.setVolume(1);
                    // child.add(sound);

                    child.material = new THREE.ShaderMaterial({
                        uniforms: uni,
                        vertexShader: document.getElementById('V_PortalShader').textContent,
                        fragmentShader: document.getElementById('F_PortalShader').textContent
                    });
                    child.add(new THREE.PointLight(0xFFFFFF, 1, 25, 2));
                }
                if (/bridge/gi.test(child.name)) {
                    // let audioLoader = new THREE.AudioLoader();
                    // let sound = new THREE.PositionalAudio(globals.listener);
                    // let sound2 = new THREE.PositionalAudio(globals.listener);
                    // audioLoader.load('/audio/creak.wav', (buffer) => {
                    //     sound.setBuffer(buffer);
                    //     sound.setRefDistance(5);
                    //     sound.setLoop(true);
                    //     sound.play();
                    // });
                    // audioLoader.load('/audio/creak2.wav', (buffer) => {
                    //     sound2.setBuffer(buffer);
                    //     sound2.setRefDistance(5);
                    //     sound2.setLoop(true);
                    //     sound2.play();
                    // });
                    // child.add(sound);
                    // child.add(sound2);

                    var tween = new TWEEN.Tween(child.rotation).to({
                        y: -Math.PI / 8
                    }, 4000).repeat(Infinity).yoyo(true).start();

                    globals.TWEENS.push(tween);
                }
            }
        });
    });
};

},{}],5:[function(require,module,exports){
'use strict';

/* global THREE */

function init(globals, player) {

    require('./world')(globals);
    require('./player')(globals, player);
    require('./bodies')(globals, player);

    globals.renderer.shadowMapEnabled = true;
    globals.renderer.shadowMapSoft = true;
    globals.renderer.shadowMapType = THREE.PCFShadowMap;

    globals.renderer.shadowCameraNear = 3;
    globals.renderer.shadowCameraFar = globals.camera.far;
    globals.renderer.shadowCameraFov = 50;

    globals.renderer.shadowMapBias = 0.0001;
    globals.renderer.shadowMapDarkness = 0.5;
    globals.renderer.shadowMapWidth = 1024;
    globals.renderer.shadowMapHeight = 1024;
    globals.renderer.setClearColor(globals.scene.fog.color, 1);
    globals.renderer.setSize(window.innerWidth, window.innerHeight);

    globals.camera.add(globals.listener);

    document.body.appendChild(globals.renderer.domElement);
}

module.exports = init;

},{"./bodies":4,"./player":6,"./world":7}],6:[function(require,module,exports){
'use strict';

/* global THREE, CANNON, PointerLockControls */

module.exports = function (globals, player) {

    var mass = 10,
        radius = 1.7;
    var sphereShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({
        mass: mass,
        material: globals.groundMaterial
    });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 30, 0);
    // sphereBody.linearDamping = 0.9;
    sphereBody.angularDamping = 0.9;
    globals.world.add(sphereBody);
    sphereBody.addEventListener('collide', function (event) {

        var contact = event.contact;
        var upAxis = new CANNON.Vec3(0, 1, 0);
        var contactNormal = new CANNON.Vec3();
        if (contact.bi.id == sphereBody.id) contact.ni.negate(contactNormal);else contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is
        if (contactNormal.dot(upAxis) > 0.5 && sphereBody.velocity.y <= -60) player.hp.val += Math.floor(sphereBody.velocity.y / 10);
    });
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshLambertMaterial());
    mesh.castShadow = true;
    globals.scene.add(mesh);
    globals.BODIES['player'] = {
        body: sphereBody,
        shape: sphereShape,
        mesh: mesh
    };

    globals.controls = new PointerLockControls(globals.camera, globals.BODIES['player'].body);
    globals.scene.add(globals.controls.getObject());

    window.controls = globals.controls;
};

},{}],7:[function(require,module,exports){
"use strict";

/* global CANNON */

module.exports = function (globals) {

    var solver = new CANNON.GSSolver();

    globals.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    globals.world.defaultContactMaterial.contactEquationRelaxation = 4;
    globals.world.defaultContactMaterial.friction = 2;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = false;
    if (split) globals.world.solver = new CANNON.SplitSolver(solver);else globals.world.solver = solver;

    globals.world.gravity.set(0, -40, 0);
    globals.world.broadphase = new CANNON.NaiveBroadphase();
};

},{}],8:[function(require,module,exports){
'use strict';

/* global $ */

var ProtoTree = require('rpg-tools/lib/ProtoTree'),
    pt = null;

var base = require('./json/base'),
    weapons = require('./json/weapons'),
    materials = require('./json/mats');

Object.assign(base, weapons, materials);
pt = new ProtoTree(base);

module.exports = function (callback) {
    callback(pt, setUpComponent, setUpSword);
};

function setUpComponent(comp, mat) {
    var c = pt.get(comp),
        m = pt.get(mat);
    c.mat = m;
    c.dmg = m.dmg;
    c.spd = m.spd;
    c.dur = m.dur;
    c.name = m.name + c.name;
    return c;
}

function setUpSword(type, mat1, mat2) {
    var sword = pt.get(type ? 'longsword' : 'shortsword'),
        blade = setUpComponent('@blade', mat1),
        handle = setUpComponent('@handle', mat2);
    sword.blade = blade;
    sword.handle = handle;
    sword.name = blade.mat.name + ' ' + sword.name;
    sword.dmg = (blade.dmg + handle.dmg) / 2;
    sword.spd = (blade.spd + handle.spd) / 2;
    return sword;
}

},{"./json/base":9,"./json/mats":10,"./json/weapons":11,"rpg-tools/lib/ProtoTree":17}],9:[function(require,module,exports){
module.exports={
    "@item": {
        name: "-- Item --",
        desc: "If you see this, please contact developers",
        weight: 0,
        ench: {}
    },
    "@weapon": {
        proto: "@item", 
        name: "-- Weapon --",
        dmg: 0,
        spd: 0,
        knbk: 0,
        slot: 0,
        cost: {}
    },
    "@sword": {
        proto: "@weapon",
        name: "-- Sword --",
        blade: {},
        handle: {}
    },
    "@blade": {
        proto: "@weapon",
        name: "-- Blade --",
        mat: {}
    },
    "@handle": {
        proto: "@weapon",
        name: "-- Handle --",
        mat: {}
    },
    "@bow": {
        proto: "@weapon",
        name: "-- Bow --",
        body: {},
        string: {}
    },
    "@body": {
        proto: "@weapon",
        name: "-- Bow Body --",
        mat: {}
    },
    "@string": {
        proto: "@weapon",
        name: "-- Bowstring --",
        mat: {}
    },
    "@spell": {
        proto: "@weapon",
        name: "-- Spell --",
        weight: 0
    },
    "@material": {
        proto: "@item",
        dur: 0,
        spd: 0,
        dmg: 0
    }
}

},{}],10:[function(require,module,exports){
module.exports={
    "wood": {
        proto: "@material",
        name: "Wood",
        desc: "A block of wood.  Interesting.",
        weight: 2,
        dmg: 3,
        dur: 1,
        spd: 4
    },
    "iron": {
        proto: "@material",
        name: "Iron",
        desc: "A bar of iron for all of your irony needs",
        weight: 5,
        dmg: 7,
        dur: 3,
        spd: 3
    },
    "steel": {
        proto: "@material",
        name: "Steel",
        desc: "A rod of steel, a steel rod",
        weight: 6,
        dmg: 12,
        dur: 5,
        spd: 3
    },
    "ebony": {
        proto: "@material",
        name: "Ebony",
        desc: "Like ebay, but ebony",
        weight: 10,
        dmg: 16,
        dur: 8,
        spd: 2
    },
    "ivory": {
        proto: "@material",
        name: "Ivory",
        desc: "A fine, delicate material",
        weight: 0.5,
        dmg: 2,
        dur: 1,
        spd: 15
    },
    "dragonivory": {
        proto: "ivory",
        name: "Dragon Ivory",
        desc: "Carved from the scales of the finest dragons in The Grove",
        dmg: 4,
        dur: 2
    }
}

},{}],11:[function(require,module,exports){
module.exports={
  "shortsword": {
    proto: "@sword",
    name: "Shortsword",
    desc: "A shortened sword",
    slot: 1
  },
  "longsword": {
    proto: "@sword",
    name: "Longsword",
    desc: "Slonglord!  Wait a sec...",
    slot: 2
  }
}
},{}],12:[function(require,module,exports){
'use strict';

/* global CANNON, THREE */

var globals = require('./globals');

function load(mesh, opts) {
    opts = opts ? opts : {};
    mesh.castShadow = true;
    mesh.recieveShadow = true;
    var verts = [],
        faces = [];
    for (var i = 0; i < mesh.geometry.vertices.length; i++) {
        var v = mesh.geometry.vertices[i];
        verts.push(new CANNON.Vec3(v.x, v.y, v.z));
    }
    for (var i = 0; i < mesh.geometry.faces.length; i++) {
        var f = mesh.geometry.faces[i];
        faces.push([f.a, f.b, f.c]);
    }
    var cvph = new CANNON.ConvexPolyhedron(verts, faces);
    var Cbody = new CANNON.Body({
        mass: opts.mass || 0,
        material: opts.material || undefined
    });
    Cbody.addShape(cvph);
    Cbody.position.copy(mesh.position);
    Cbody.quaternion.copy(mesh.quaternion);
    globals.world.add(Cbody);
    globals.BODIES['items'].push({
        body: Cbody,
        shape: cvph,
        mesh: mesh
    });
    return {
        body: Cbody,
        shape: cvph,
        mesh: mesh
    };
}

function box(opts) {
    opts = opts ? opts : {};

    var halfExtents = new CANNON.Vec3(opts.l !== undefined ? opts.l : 1, opts.h !== undefined ? opts.h : 1, opts.w !== undefined ? opts.w : 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({
        mass: opts.mass || 0
    });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, opts.mat !== undefined ? opts.mat : new THREE.MeshPhongMaterial({
        color: 0xFF0000
    }));
    globals.world.add(boxBody);
    globals.scene.add(boxMesh);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    globals.BODIES['items'].push({
        body: boxBody,
        shape: boxShape,
        mesh: boxMesh
    });

    return {
        body: boxBody,
        shape: boxShape,
        mesh: boxMesh
    };
}

function ball(opts) {
    opts = opts ? opts : {};
    var ballShape = new CANNON.Sphere(opts.radius || 0.2);
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
    var ballBody = new CANNON.Body({
        mass: opts.mass !== undefined ? opts.mass : 10
    });

    ballBody.addShape(ballShape);
    var ballMesh = new THREE.Mesh(ballGeometry, opts.mat || new THREE.MeshPhongMaterial({
        color: opts.c || 0x00CCFF
    }));
    globals.world.add(ballBody);
    globals.scene.add(ballMesh);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    globals.BODIES[opts.array || 'items'].push({
        body: ballBody,
        shape: ballShape,
        mesh: ballMesh
    });

    return {
        body: ballBody,
        shape: ballShape,
        mesh: ballMesh
    };
}

function plane(opts) {
    // BROKEN!!!!!
    var geometry = new THREE.PlaneGeometry(5, 20, 32);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);
    globals.scene.add(plane);

    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({
        mass: 0,
        shape: groundShape
    });
    globals.world.add(groundBody);

    globals.BODIES[opts.array || 'items'].push({
        body: groundBody,
        shape: groundShape,
        mesh: plane
    });

    return {
        body: groundBody,
        shape: groundShape,
        mesh: plane
    };
}

function label(mesh) {
    var txt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var icon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'run';


    var fontface = "Arial";

    var fontsize = 18;

    var borderThickness = 4;

    var borderColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 1.0
    };

    var backgroundColor = {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText(txt);
    var textWidth = metrics.width;

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText(txt, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 2.5, 1.0);
    mesh.add(sprite);
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

module.exports.load = load;
module.exports.box = box;
module.exports.label = label;
module.exports.ball = ball;
module.exports.plane = plane;

},{"./globals":2}],13:[function(require,module,exports){
'use strict';

/* global $, THREE */

var globals = require('./globals');
var player = require('./player');

var dt = 1 / 60;

require('./items');
require('./gui').init();
require('./shooting')(globals, player);
require('./multiplayer')(globals, player);

THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
    console.log(loaded + ' out of ' + total);
    if (loaded == total) {
        $('#spinner').hide();
        $('#load-play-btn, .play-btn').show();
        animate();
        require('./gui').quests();
    }
};

function animate(delta) {

    if (window.controls && window.controls.enabled) {

        // globals.camera.updateMatrixWorld(); // make sure the camera matrix is updated
        // globals.camera.matrixWorldInverse.getInverse(globals.camera.matrixWorld);
        // globals.cameraViewProjectionMatrix.multiplyMatrices(globals.camera.projectionMatrix, globals.camera.matrixWorldInverse);
        // globals.frustum.setFromMatrix(globals.cameraViewProjectionMatrix);

        if (globals.remove.bodies.length && globals.remove.meshes.length) {
            for (var key in globals.remove.bodies) {
                globals.world.remove(globals.remove.bodies[key]);
                delete globals.remove.bodies[key];
            }
            for (var _key in globals.remove.meshes) {
                globals.scene.remove(globals.remove.meshes[_key]);
                delete globals.remove.meshes[_key];
            }
        } else if (globals.remove.tweens.length) {
            for (var _key2 in globals.remove.tweens) {
                globals.TWEENS[globals.remove.bodies[_key2]].stop();
                delete globals.remove.tweens[_key2];
            }
        }

        // Update bullets, etc.
        for (var i = 0; i < globals.BODIES['projectiles'].length; i++) {
            globals.BODIES['projectiles'][i].mesh.position.copy(globals.BODIES['projectiles'][i].body.position);
            globals.BODIES['projectiles'][i].mesh.quaternion.copy(globals.BODIES['projectiles'][i].body.quaternion);
        }

        // Update items
        for (var _i = 0; _i < globals.BODIES['items'].length; _i++) {
            globals.BODIES['items'][_i].mesh.position.copy(globals.BODIES['items'][_i].body.position);
            globals.BODIES['items'][_i].mesh.quaternion.copy(globals.BODIES['items'][_i].body.quaternion);
        }

        for (var _key3 in globals.TWEENS) {
            globals.TWEENS[_key3].update(delta);
        }

        globals.BODIES['player'].mesh.position.copy(globals.BODIES['player'].body.position);
        if (globals.BODIES['player'].body.position.y < -400) player.hp.val--;

        $('#health-bar').val(player.hp.val / player.hp.max * 100 > 0 ? player.hp.val / player.hp.max * 100 : 0);
        $('#health').text((player.hp.val > 0 ? player.hp.val : 0) + ' HP');
        if (player.hp.val <= 0) {
            globals.socket.disconnect();
            $('#blocker').fadeIn(5000);
            $('#load').show().html('<a style="font-size:32pt;" href="/play">You Have Perished</a>');
            return;
        }

        for (var _key4 in globals.composers) {
            globals.composers[_key4].render(delta);
        }globals.world.step(dt);
        globals.controls.update(Date.now() - globals.delta);
        // globals.rendererDEBUG.update();
        globals.renderer.render(globals.scene, globals.camera);
        globals.delta = Date.now();

        if (player && player.serverdata && globals && globals.updatePlayerData) {
            globals.updatePlayerData();
            globals.socket.emit('updatePosition', player.serverdata);
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    globals.camera.aspect = window.innerWidth / window.innerHeight;
    globals.camera.updateProjectionMatrix();
    globals.renderer.setSize(window.innerWidth, window.innerHeight);
}

},{"./globals":2,"./gui":3,"./items":8,"./multiplayer":14,"./player":15,"./shooting":16}],14:[function(require,module,exports){
"use strict";

/* global $, THREE, Materialize */

module.exports = function (globals, player) {

    $(window).bind("online", function () {
        return Materialize.toast('Connection restored', 4000);
    });
    $(window).bind("offline", function () {
        return Materialize.toast('Connection lost', 4000);
    });

    globals.socket.emit('client-credentials', {
        username: window.__D.username,
        password: window.__D.password
    });

    window.__D = undefined;
    delete window.__D;

    globals.socket.emit('requestOldPlayers', {});

    globals.socket.on('createPlayer', function (data) {
        if (typeof player.serverdata === 'undefined') {

            player.serverdata = data;
            player.id = data.id;

            Object.assign(player.inventory, player.serverdata.acc.inventory);

            require('./init/manager')(globals, player);
        }
    });

    globals.socket.on('addOtherPlayer', function (data) {
        if (data.id !== player.id) {
            var cube = globals.box({
                l: 1,
                w: 1,
                h: 2,
                mass: 0
            });
            var loader = new THREE.ObjectLoader();
            // loader.load('/models/sword/sword.json', sword => {
            //     sword.scale.set(0.2, 0.2, 0.2);
            //     sword.castShadow = true;
            //     cube.mesh.add(sword);
            //     sword.position.x += 0.7;
            //     sword.position.y -= 0.375;
            //     sword.position.z -= 1.25;
            // });
            globals.PLAYERS.push({
                body: cube.body,
                mesh: cube.mesh,
                id: data.id,
                data: data
            });
            globals.label(cube.mesh, data.acc.level + ' - ' + data.acc.username);
            Materialize.toast("<span style='color:lightblue'>" + data.acc.username + " joined</span>", 4000);
        }
    });

    globals.socket.on('removeOtherPlayer', function (data) {

        globals.scene.remove(playerForId(data.id).mesh);
        globals.world.remove(playerForId(data.id).body);
        Materialize.toast(data.acc.username + " left", 4000);
        console.log(data.id + ' disconnected');
    });

    globals.socket.on('updatePosition', function (data) {

        var somePlayer = playerForId(data.id);
        if (somePlayer) {
            somePlayer.body.position.x = data.x;
            somePlayer.body.position.y = data.y;
            somePlayer.body.position.z = data.z;

            // somePlayer.body.q.x = data.q.x;
            // somePlayer.body.q.y = data.q.y;
            // somePlayer.body.q.z = data.q.z;
            // somePlayer.body.q.w = data.q.w;
        }
    });

    globals.socket.on('bullet', function (_ref) {
        var pos = _ref.pos,
            vel = _ref.vel;

        var ball = globals.ball({
            array: 'projectiles'
        });
        ball.body.position.set(pos.x, pos.y, pos.z);
        ball.body.velocity.set(vel.x, vel.y, vel.z);
        ball.mesh.position.set(pos.x, pos.y, pos.z);

        ball.body.addEventListener("collide", function (event) {
            setTimeout(function () {
                globals.remove.bodies.push(ball.body);
                globals.remove.meshes.push(ball.mesh);
            }, 1500);
        });
    });

    globals.socket.on('hit', function (data) {
        if (data.id == player.id) player.hp.val--;
    });

    var updatePlayerData = function updatePlayerData() {

        player.serverdata.x = globals.BODIES['player'].body.position.x;
        player.serverdata.y = globals.BODIES['player'].body.position.y;
        player.serverdata.z = globals.BODIES['player'].body.position.z;

        player.serverdata.q = globals.BODIES['player'].body.quaternion;
    };

    var playerForId = function playerForId(id) {
        var index = void 0;
        for (var i = 0; i < globals.PLAYERS.length; i++) {
            if (globals.PLAYERS[i].id == id) {
                index = i;
                break;
            }
        }
        return globals.PLAYERS[index];
    };
    // CHAT STARTS HERE
    globals.socket.on('chat-msg', function (player, msg) {
        Materialize.toast(player + ": " + msg, 10000);
    });

    var msgs = 0;

    $(window).on('keydown', function (e) {
        if (e.keyCode == 13 && $('#chat-input').is(':focus') && msgs < 5) {
            globals.socket.emit('chat-msg', player.serverdata.acc.username, $('#chat-input').val());
            $('#chat-input').val('');
            $('#chat-input').blur();
            msgs++;
            setTimeout(function () {
                msgs--;
            }, 5000);
        } else if (e.keyCode == 84 && !$('#chat-input').is(':focus')) {
            setTimeout(function () {
                $('#chat-input').focus();
                $('#chat-input').val(' ');
            }, 100);
        }
    });
    // Button for chat is (Insert chat-button here)
    // Button to send chat is (Insert send-button here)
    // CHAT ENDS HERE
    globals.socket.on('clear', function () {
        for (var i = globals.scene.children.length - 1; i >= 0; i--) {
            globals.scene.remove(globals.scene.children[i]);
        }
    });

    globals.socket.on('reload', function () {
        return window.location.reload();
    });

    globals.updatePlayerData = updatePlayerData;
    globals.playerForId = playerForId;
};

},{"./init/manager":5}],15:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */

var Player = function Player() {
    var _this = this;

    _classCallCheck(this, Player);

    this.hp = {
        val: 10,
        max: 10
    };
    this.mp = {
        val: 5,
        max: 5
    };
    this.equipped = {
        weapon: null
    };
    this.inventory = [];
    this.hotbar = [];

    require('./items')(function (pt, comp, sword) {
        var s = sword(0, 'iron', 'wood');
        s.slot = 'weapon';
        _this.inventory.push(s);
    });
};

var player = new Player();

module.exports = player;

},{"./items":8}],16:[function(require,module,exports){
'use strict';

/* global THREE, CANNON, TWEEN, $ */

module.exports = function (globals, player) {

    var sword = void 0;
    var weapon = void 0;

    var loader = new THREE.ObjectLoader();
    loader.load('/models/sword/sword.json', function (s) {
        sword = s;
        sword.scale.set(0.1, 0.1, 0.1);
        sword.castShadow = true;
        sword.position.x++;
        sword.position.y -= 1.2;
        sword.position.z -= 1.25;
    });

    if ($('#hb-1').data('item') !== undefined) player.equipped.weapon = $('#hb-1').data('item');

    function addWeapon() {
        if (player.equipped.weapon && /sword/gi.test(player.equipped.weapon.name) && !weapon) {
            weapon = sword.clone();
            globals.camera.add(weapon);
            window.addEventListener('mousedown', function () {
                if (weapon) {
                    var tween = new TWEEN.Tween(weapon.rotation).to({
                        x: [-Math.PI / 2, 0]
                    }, 1 / player.equipped.weapon.spd * 2000).onStart(function () {
                        var a = new Audio('/audio/sword.mp3');
                        a.play();
                    }).start();

                    globals.TWEENS.push(tween);
                }
            });
        } else if (!player.equipped.weapon) {
            globals.camera.remove(weapon);
            weapon = null;
        }
    }

    function getShootDir(targetVec) {
        var projector = new THREE.Projector();
        var vector = targetVec;
        targetVec.set(0, 0, 1);
        projector.unprojectVector(vector, globals.camera);
        var ray = new THREE.Ray(globals.BODIES['player'].body.position, vector.sub(globals.BODIES['player'].body.position).normalize());
        targetVec.copy(ray.direction);
    }

    function shoot(e) {
        if (globals.controls.enabled == true && player.equipped) {
            (function () {

                var shootDirection = new THREE.Vector3();
                var shootVelo = 20;

                var x = globals.BODIES['player'].body.position.x;
                var y = globals.BODIES['player'].body.position.y;
                var z = globals.BODIES['player'].body.position.z;

                var ball = globals.ball({
                    array: 'projectiles',
                    c: player.equipped == 'rock' ? 0xCCCCCC : 0xFF4500
                });

                getShootDir(shootDirection);
                ball.body.velocity.set(shootDirection.x * shootVelo, shootDirection.y * shootVelo, shootDirection.z * shootVelo);

                // Move the ball outside the player sphere
                x += shootDirection.x * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
                y += shootDirection.y * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
                z += shootDirection.z * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
                ball.body.position.set(x, y, z);
                ball.mesh.position.set(x, y, z);
                ball.id = Math.random();

                ball.body.addEventListener("collide", function (event) {
                    var contact = event.contact;
                    if (contact.bj.id != ball.body.id) for (var key in globals.PLAYERS) {
                        if (contact.bj == globals.PLAYERS[key].body) globals.socket.emit('hit-player', globals.PLAYERS[key].id);
                    }
                    setTimeout(function () {
                        globals.remove.bodies.push(ball.body);
                        globals.remove.meshes.push(ball.mesh);
                    }, 1500);
                });

                globals.socket.emit('bullet', {
                    pos: {
                        x: x,
                        y: y,
                        z: z
                    },
                    vel: {
                        x: ball.body.velocity.x,
                        y: ball.body.velocity.y,
                        z: ball.body.velocity.z
                    }
                });
            })();
        }
    }

    setInterval(addWeapon, 500);

    // $(document).on('mousedown', shoot);
    $(document).on('keydown', function (event) {
        if (String.fromCharCode(event.keyCode) == 'E') {
            var raycaster = new THREE.Raycaster();
            raycaster.set(globals.camera.getWorldPosition(), globals.camera.getWorldDirection());
            var intersects = raycaster.intersectObjects(globals.scene.children, true);
            if (intersects.length > 0) {
                if (/door/gi.test(intersects[0].object.name)) globals.socket.emit('map-update', {
                    username: player.serverdata.acc.username,
                    password: player.serverdata.acc.password,
                    map: 'skjar-isles'
                });
            }
        }
        if (String.fromCharCode(event.keyCode) == 'Q') require('./gui').stats(player);
        try {
            if ($('#hb-' + String.fromCharCode(event.keyCode)).length) {
                $('.hotbar').removeClass('active');
                $('#hb-' + String.fromCharCode(event.keyCode)).addClass('active');
                if ($('#hb-' + String.fromCharCode(event.keyCode)).text() !== '-') player.equipped.weapon = $('#hb-' + String.fromCharCode(event.keyCode)).data('item');else player.equipped.weapon = null;
            }
        } catch (err) {}
    });
};

},{"./gui":3}],17:[function(require,module,exports){
(function (root, factory) {
    'use strict';
    /* global define, module, require */
    if (typeof define === 'function' && define.amd) { // AMD
        define(['./utils'], factory);
    } else if (typeof exports === 'object') { // Node, browserify and alike
        module.exports = factory(require('./utils'));
    } else { // Browser globals (root is window)
        root.rpgTools = (root.rpgTools || {});
        root.rpgTools.ProtoTree = factory(root.rpgTools.utils);
    }
}(this, function (utils) {
    'use strict';

    function ProtoTree (tree) {
        this._tree = tree;
        this._processed = Object.create(null);
    }

    ProtoTree.prototype = {
        constructor: ProtoTree,

        derive: function (obj) {
            var proto = this._processed[obj.proto];

            if (proto) {
                return this.deepDefaults(obj, proto);
            } else {
                proto = this._tree[obj.proto];
            }

            if (!proto) {
                throw new TypeError('Invalid proto specified for ' + obj.name);
            }
            obj.proto = proto.proto;

            return this.deepDefaults(obj, proto);
        },

        get: function (name) {
            var item = this._processed[name];

            if (item) {
                return item;
            } else {
                item = this._tree[name];
            }

            if (!item) {
                throw new RangeError('No such object in given tree as ' + name);
            }

            while (('proto' in item) && item.proto) {
                item = this.derive(item);
            }

            // should be undefined or otherwise falsy, so we don't need it anyway
            delete item.proto;

            this._processed[name] = item;

            return item;
        },

        deepDefaults: function (obj, defaults) {
            Object.keys(defaults).forEach(function (key) {
                if (utils.isObject(defaults[key])) {
                    if (obj[key] === undefined) {
                        obj[key] = {};
                    }

                    obj[key] = this.deepDefaults(obj[key], defaults[key]);
                } else if (Array.isArray(defaults[key])) {
                    if (obj[key] === undefined) {
                        obj[key] = [];
                    }

                    obj[key] = this.deepDefaults(obj[key], defaults[key]);
                } else if (obj[key] === undefined) {
                    obj[key] = defaults[key];
                }
            }, this);

            return obj;
        }
    };

    return ProtoTree;
}));
},{"./utils":18}],18:[function(require,module,exports){
(function (root, factory) {
    'use strict';
    /* global define, module, require */
    if (typeof define === 'function' && define.amd) { // AMD
        define([], factory);
    } else if (typeof exports === 'object') { // Node, browserify and alike
        module.exports = factory();
    } else { // Browser globals (root is window)
        root.rpgTools = (root.rpgTools || {});
        root.rpgTools.utils = factory();
    }
}(this, function () {
    'use strict';

    var toString = Object.prototype.toString;

    function isString (value) {
        return toString.call(value) === '[object String]';
    }

    function isNumber (value) {
        return toString.call(value) === '[object Number]';
    }

    function isObject (value) {
        var type = typeof value;
        return !Array.isArray(value) && (type === 'object' && !!value);
    }

    function keyPath (target, path, value) {
        var chunks = path.split('.');

        if (chunks.length === 1) {
            if (arguments.length === 2) {
                return target[path];
            } else {
                target[path] = value;
                return value;
            }
        }

        var i = 1;
        var len = chunks.length;
        var chunk = chunks[0];
        var current = target[chunk];

        if (arguments.length === 2) {
            while (i < len) {
                chunk = chunks[i];
                current = current[chunk];
                i++;
            }

            return current;
        } else {
            while (i < len - 1) {
                chunk = chunks[i];
                current = current[chunk];
                i++;
            }

            current[chunks[i]] = value;

            return value;
        }
    }

    function clone (value) {
        if (isObject(value)) {
            return JSON.parse(JSON.stringify(value));
        } else {
            return value;
        }
    }

    var exports = {
        isString: isString,
        isNumber: isNumber,
        isObject: isObject,
        keyPath: keyPath,
        clone: clone
    };

    return exports;
}));

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
