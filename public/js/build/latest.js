(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global THREE, CANNON */

module.exports = {
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({
        antialias: true
    }),
    camera: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000),

    world: new CANNON.World(),

    MESHES: {
        items: [],
        projectiles: []
    },
    BODIES: {
        items: [],
        projectiles: []
    },
    LABELS: [],

    otherPlayers: [],
    otherPlayersId: [],

    delta: Date.now(),
    frustum: new THREE.Frustum(),
    cameraViewProjectionMatrix: new THREE.Matrix4()
};

module.exports.rendererDEBUG = new THREE.CannonDebugRenderer(module.exports.scene, module.exports.world);

},{}],2:[function(require,module,exports){
"use strict";

/* global THREE, CANNON */

module.exports = function (globals) {

    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({
        mass: 0
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    globals.world.add(groundBody);

    globals.scene.fog = new THREE.FogExp2(0x110011, 0.02);

    var ambient = new THREE.AmbientLight(0x111111);
    globals.scene.add(ambient);

    var light = new THREE.SpotLight(0xffffff);
    light.position.set(10, 30, 20);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    light.shadowCameraNear = globals.camera.near;
    light.shadowCameraFar = globals.camera.far;
    light.shadowCameraFov = globals.camera.fov;

    light.shadowMapBias = -1;
    light.shadowMapDarkness = 0.5;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    light.shadowCameraVisible = true;
    globals.scene.add(light);

    // floor
    var geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        color: 0x00FF00,
        shininess: 10
    }));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    globals.scene.add(mesh);
};

},{}],3:[function(require,module,exports){
'use strict';

function init(globals) {

    require('./world')(globals);
    require('./bodies')(globals);
    require('./player')(globals);

    globals.renderer.shadowMapEnabled = true;
    globals.renderer.shadowMapSoft = true;
    globals.renderer.setClearColor(globals.scene.fog.color, 1);
    globals.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(globals.renderer.domElement);
}

module.exports = init;

},{"./bodies":2,"./player":4,"./world":5}],4:[function(require,module,exports){
'use strict';

/* global THREE, CANNON, PointerLockControls */

module.exports = function (globals) {

    var mass = 5,
        radius = 1.3;
    var sphereShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({
        mass: mass
    });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    // sphereBody.linearDamping = 0.9;
    sphereBody.angularDamping = 0.9;
    globals.world.add(sphereBody);
    globals.BODIES['player'] = {
        body: sphereBody,
        shape: sphereShape
    };

    globals.MESHES['player'] = new THREE.Mesh(new THREE.BoxGeometry(1, 2.5, 1), new THREE.MeshLambertMaterial());
    globals.MESHES['player'].castShadow = true;
    globals.scene.add(globals.MESHES['player']);

    globals.controls = new PointerLockControls(globals.camera, globals.BODIES['player'].body);
    globals.scene.add(globals.controls.getObject());

    window.controls = globals.controls;
};

},{}],5:[function(require,module,exports){
"use strict";

/* global CANNON */

module.exports = function (globals) {

    var solver = new CANNON.GSSolver();

    globals.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    globals.world.defaultContactMaterial.contactEquationRelaxation = 4;
    globals.world.defaultContactMaterial.friction = 1e9;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if (split) globals.world.solver = new CANNON.SplitSolver(solver);else globals.world.solver = solver;

    globals.world.gravity.set(0, -20, 0);
    globals.world.broadphase = new CANNON.NaiveBroadphase();
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (globals) {

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
            mass: opts.mass || 0
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

        var halfExtents = new CANNON.Vec3(opts.l || 1, opts.h || 1, opts.w || 1);
        var boxShape = new CANNON.Box(halfExtents);
        var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
        var boxBody = new CANNON.Body({
            mass: opts.mass || 0
        });
        boxBody.addShape(boxShape);
        var boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({
            color: 0xFF0000
        }));
        globals.world.add(boxBody);
        globals.scene.add(boxMesh);
        boxBody.position.set(opts.x || 0, opts.y || 10, opts.z || 0);
        boxMesh.position.set(opts.x || 0, opts.y || 10, opts.z || 0);
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
            mass: 100
        });

        ballBody.addShape(ballShape);
        var ballMesh = new THREE.Mesh(ballGeometry, new THREE.MeshLambertMaterial({
            color: Math.random() * 0xFFFFFF
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

    function label(mesh, txt) {
        var element = document.createElement('h2');
        document.body.appendChild(element);
        element.style.color = 'white';
        element.style.position = 'absolute';
        element.innerHTML = txt || 'BLAH BLAH BLAH';
        globals.LABELS.push(function () {
            var position = THREEx.ObjCoord.cssPosition(mesh, globals.camera, globals.renderer);
            var boundingRect = element.getBoundingClientRect();
            element.style.left = position.x - boundingRect.width / 2 + 'px';
            element.style.top = position.y - boundingRect.height / 2 - 70 + 'px';
            if (globals.frustum.intersectsObject(mesh)) element.style.opacity = 1;else element.style.opacity = 0;
        });
    }

    globals.load = load;
    globals.load.box = box;
    globals.load.label = label;
    globals.load.ball = ball;

    // this.load = load;
    // this.box = box;
    // this.label = label;
    // this.ball = ball;
};

},{}],7:[function(require,module,exports){
'use strict';

/* global socket */

var globals = require('./globals');
var player = require('./player');

var dt = 1 / 60;

require('./init/manager')(globals);
require('./load')(globals);
require('./shooting')(globals);
require('./multiplayer')(globals, player);

animate();

function animate(delta) {

    requestAnimationFrame(animate);

    globals.camera.updateMatrixWorld(); // make sure the camera matrix is updated
    globals.camera.matrixWorldInverse.getInverse(globals.camera.matrixWorld);
    globals.cameraViewProjectionMatrix.multiplyMatrices(globals.camera.projectionMatrix, globals.camera.matrixWorldInverse);
    globals.frustum.setFromMatrix(globals.cameraViewProjectionMatrix);

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

    // Update labels
    for (var key in globals.LABELS) {
        globals.LABELS[key]();
    }globals.BODIES['player'].body.velocity.set(globals.BODIES['player'].body.velocity.x * 0.95, globals.BODIES['player'].body.velocity.y, globals.BODIES['player'].body.velocity.z * 0.95);
    globals.MESHES['player'].position.copy(globals.BODIES['player'].body.position);

    globals.world.step(dt);
    globals.controls.update(Date.now() - globals.delta);
    // globals.rendererDEBUG.update();
    globals.renderer.render(globals.scene, globals.camera);
    globals.delta = Date.now();

    if (player && player.serverdata && globals && globals.updatePlayerData) {
        globals.updatePlayerData();
        socket.emit('updatePosition', player.serverdata);
    }
}

},{"./globals":1,"./init/manager":3,"./load":6,"./multiplayer":8,"./player":9,"./shooting":10}],8:[function(require,module,exports){
'use strict';

/* global socket */

module.exports = function (globals, player) {

    socket.emit('requestOldPlayers', {});

    socket.on('createPlayer', function (data) {
        if (typeof player.serverdata === 'undefined') {

            player.serverdata = data;
            player.id = data.id;

            player.inventory = player.serverdata.acc.inventory;
        }
    });

    socket.on('addOtherPlayer', function (data) {
        if (data.id !== player.id) {
            var cube = globals.load.box({
                l: 1,
                w: 1,
                h: 2,
                mass: 0
            });
            cube.body.position.set(data.x, data.y, data.z);
            globals.otherPlayersId.push(data.id);
            globals.otherPlayers.push(cube);
            globals.load.label(cube.mesh, data.acc.level + ' - ' + data.acc.username);
        }
    });

    socket.on('removeOtherPlayer', function (data) {

        globals.scene.remove(playerForId(data.id).mesh);
        globals.world.remove(playerForId(data.id).body);
        console.log(data.id + ' disconnected');
    });

    socket.on('updatePosition', function (data) {

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

    socket.on('bullet', function (pos) {
        alert('boi');
        var ball = globals.load.ball({
            array: 'projectiles'
        });
        ball.body.position.set(pos.x, pos.y, pos.z);
        ball.mesh.position.set(pos.x, pos.y, pos.z);
    });

    var updatePlayerData = function updatePlayerData() {

        player.serverdata.x = globals.BODIES['player'].body.position.x;
        player.serverdata.y = globals.BODIES['player'].body.position.y;
        player.serverdata.z = globals.BODIES['player'].body.position.z;

        player.serverdata.q = globals.BODIES['player'].body.quaternion;
    };

    var playerForId = function playerForId(id) {
        var index = void 0;
        for (var i = 0; i < globals.otherPlayersId.length; i++) {
            if (globals.otherPlayersId[i] == id) {
                index = i;
                break;
            }
        }
        return globals.otherPlayers[index];
    };

    socket.on('clear', function () {
        for (var i = globals.scene.children.length - 1; i >= 0; i--) {
            globals.scene.remove(globals.scene.children[i]);
        }
    });

    socket.on('reload', function () {
        window.location.reload();
    });

    globals.updatePlayerData = updatePlayerData;
    globals.playerForId = playerForId;
};

},{}],9:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],10:[function(require,module,exports){
'use strict';

/* global THREE, CANNON, socket */

module.exports = function (globals) {

    function getShootDir(targetVec) {
        var projector = new THREE.Projector();
        var vector = targetVec;
        targetVec.set(0, 0, 1);
        projector.unprojectVector(vector, globals.camera);
        var ray = new THREE.Ray(globals.BODIES['player'].body.position, vector.sub(globals.BODIES['player'].body.position).normalize());
        targetVec.copy(ray.direction);
    }

    window.addEventListener("click", function (e) {
        if (globals.controls.enabled == true) {

            var shootDirection = new THREE.Vector3();
            var shootVelo = 15;

            var x = globals.BODIES['player'].body.position.x;
            var y = globals.BODIES['player'].body.position.y;
            var z = globals.BODIES['player'].body.position.z;

            var ball = globals.load.ball({
                array: 'projectiles'
            });

            getShootDir(shootDirection);
            ball.body.velocity.set(shootDirection.x * shootVelo, shootDirection.y * shootVelo, shootDirection.z * shootVelo);

            // Move the ball outside the player sphere
            x += shootDirection.x * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
            y += shootDirection.y * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
            z += shootDirection.z * (globals.BODIES['player'].shape.radius * 1.02 + ball.shape.radius);
            ball.body.position.set(x, y, z);
            ball.mesh.position.set(x, y, z);

            socket.emit('bullet', {
                x: x,
                y: y,
                z: z
            });
        }
    });
};

},{}]},{},[1,2,3,4,5,6,7,8,9,10]);
