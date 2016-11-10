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

        this.shape = new THREE.Mesh(new THREE.BoxGeometry(5, 10, 5), new THREE.MeshLambertMaterial({
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
"use strict";

/* global THREE, CANNON */

module.exports = {
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({
        antialias: true
    }),
    camera: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000),

    world: new CANNON.World(),

    socket: io(),

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

// module.exports.rendererDEBUG = new THREE.CannonDebugRenderer(module.exports.scene, module.exports.world);
// Adjust constraint equation parameters for ground/ground contact
var ground_ground_cm = new CANNON.ContactMaterial(module.exports.groundMaterial, module.exports.groundMaterial, {
    friction: 1e60,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3
});

// Add contact material to the world
module.exports.world.addContactMaterial(ground_ground_cm);

var load = require('./load');
module.exports.load = load.load;
module.exports.box = load.box;
module.exports.label = load.label;
module.exports.ball = load.ball;

},{"./load":8}],3:[function(require,module,exports){
"use strict";

/* global THREE, CANNON, $ */

module.exports = function (globals, player) {

    globals.scene.fog = new THREE.FogExp2(0x110011, 0.02);

    var ambient = new THREE.AmbientLight(0x111111);
    globals.scene.add(ambient);

    var light = new THREE.SpotLight(0xffffff, 3, 100, 1, 0.5, 1);
    light.position.set(0, 50, 0);
    light.target.position.set(0, 0, 0);
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

    var loader = new THREE.ObjectLoader();
    loader.load("/models/" + player.serverdata.acc.map + "/" + player.serverdata.acc.map + ".json", function (object) {
        globals.scene.add(object);
        object.castShadow = true;
        object.recieveShadow = true;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.recieveShadow = true;
                var _o = globals.load(child, {
                    mass: 0,
                    material: globals.groundMaterial
                });
                _o.body.position.z += 15;
                _o.mesh.position.z += 15;
            }
        });
    });
    // loader.load(`/models/alchemy-table/alchemy-table.json`, (object) => {
    //     globals.scene.add(object);
    //     object.castShadow = true;
    //     object.recieveShadow = true;
    //     object.position.set(0, 30, 10);
    // });
};

},{}],4:[function(require,module,exports){
'use strict';

/* global $ */

module.exports = function () {
    $(document).ready(function () {
        $('#splash-title').text('In the beginning, the Grove Tree was planted.');
        setTimeout(function () {

            $('#splash-title').fadeOut(950);
            setTimeout(function () {
                $('#splash-title').text('Its presence infused the souls of mankind with a magical essence...');
            }, 950);
            $('#splash-title').fadeIn(950);

            setTimeout(function () {

                $('#splash-title').fadeOut(950);
                setTimeout(function () {
                    $('#splash-title').text('There were those jealous of this extreme power...');
                }, 950);
                $('#splash-title').fadeIn(950);

                setTimeout(function () {

                    $('#splash-title').fadeOut(950);
                    setTimeout(function () {
                        $('#splash-title').text('12 Alchemists, of heightened skill...');
                    }, 950);
                    $('#splash-title').fadeIn(950);

                    setTimeout(function () {

                        $('#splash-title').fadeOut(950);
                        setTimeout(function () {
                            $('#splash-title').text('They attempted to create a power of their own, to combat those naturally infused...');
                        }, 950);
                        $('#splash-title').fadeIn(950);

                        setTimeout(function () {

                            $('#splash-title').fadeOut(950);
                            setTimeout(function () {
                                $('#splash-title').text('Eventually, they succeeded, but...');
                            }, 950);
                            $('#splash-title').fadeIn(950);

                            setTimeout(function () {

                                $('#splash-title').fadeOut(950);
                                setTimeout(function () {
                                    $('#splash-title').text('Their creation consumed them, turning them into unimaginable demons...');
                                }, 950);
                                $('#splash-title').fadeIn(950);

                                setTimeout(function () {

                                    $('#splash-title').fadeOut(950);
                                    setTimeout(function () {
                                        $('#splash-title').text('Finally, put to rest by The Developer, they were banished from these lands...');
                                    }, 950);
                                    $('#splash-title').fadeIn(950);

                                    setTimeout(function () {

                                        $('#splash-title').fadeOut(950);
                                        setTimeout(function () {
                                            $('#splash-title').text('Now, they are back, attacking the original Tree and its power...');
                                        }, 950);
                                        $('#splash-title').fadeIn(950);

                                        setTimeout(function () {

                                            $('#splash-title').fadeOut(950);
                                            setTimeout(function () {
                                                $('#splash-title').text('And it is up to you to stop them.');
                                            }, 950);
                                            $('#splash-title').fadeIn(950);

                                            setTimeout(function () {

                                                $('#splash-title').fadeOut(950);
                                                setTimeout(function () {
                                                    $('#splash-title').text('THE GROVE');
                                                }, 950);
                                                $('#splash-title').fadeIn(950);
                                            }, 3000);
                                        }, 3000);
                                    }, 3000);
                                }, 3000);
                            }, 3000);
                        }, 3000);
                    }, 3000);
                }, 3000);
            }, 3000);
        }, 3000);
    });
};

},{}],5:[function(require,module,exports){
'use strict';

function init(globals, player) {

    require('./world')(globals);
    require('./bodies')(globals, player);
    require('./player')(globals);
    require('./dom')(globals);

    globals.renderer.shadowMapEnabled = true;
    globals.renderer.shadowMapSoft = false;
    globals.renderer.setClearColor(globals.scene.fog.color, 1);
    globals.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(globals.renderer.domElement);
}

module.exports = init;

},{"./bodies":3,"./dom":4,"./player":6,"./world":7}],6:[function(require,module,exports){
'use strict';

/* global THREE, CANNON, PointerLockControls */

module.exports = function (globals) {

    var mass = 10,
        radius = 1.3;
    var sphereShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({
        mass: mass,
        material: globals.groundMaterial
    });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 15, 0);
    // sphereBody.linearDamping = 0.9;
    sphereBody.angularDamping = 0.9;
    globals.world.add(sphereBody);
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
    globals.world.defaultContactMaterial.friction = 1e9;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = false;
    if (split) globals.world.solver = new CANNON.SplitSolver(solver);else globals.world.solver = solver;

    globals.world.gravity.set(0, -20, 0);
    globals.world.broadphase = new CANNON.NaiveBroadphase();
};

},{}],8:[function(require,module,exports){
'use strict';

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

    var halfExtents = new CANNON.Vec3(opts.l || 1, opts.h || 1, opts.w || 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({
        mass: opts.mass || 0
    });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial({
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
        mass: 10
    });

    ballBody.addShape(ballShape);
    var ballMesh = new THREE.Mesh(ballGeometry, new THREE.MeshPhongMaterial({
        color: 0x00CCFF
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

function label(mesh) {
    var txt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var icon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'run';

    var element = document.createElement('span');
    document.body.appendChild(element);
    element.style.position = 'absolute';
    element.style.paddingRight = '10px';
    element.style.backgroundColor = '#aaa';
    element.innerHTML = '<img src=/img/icons/' + icon + '.png> ' + txt;
    globals.LABELS.push(function () {
        var position = THREEx.ObjCoord.cssPosition(mesh, globals.camera, globals.renderer);
        var boundingRect = element.getBoundingClientRect();
        element.style.left = position.x - boundingRect.width / 2 + 'px';
        element.style.top = position.y - boundingRect.height / 2 - 70 + 'px';
        if (globals.frustum.intersectsObject(mesh)) element.style.opacity = 1;else element.style.opacity = 0;
    });
}

module.exports.load = load;
module.exports.box = box;
module.exports.label = label;
module.exports.ball = ball;

},{"./globals":2}],9:[function(require,module,exports){
'use strict';

/* global $ */

var globals = require('./globals');
var player = require('./player');

var dt = 1 / 60;

// require('./load')(globals);
require('./shooting')(globals);
require('./multiplayer')(globals, player);

THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
    console.log(loaded + ' out of ' + total);
    $('#loading-bar').width(loaded / total * 100 + '%').text(loaded + ' / ' + total + ' - ' + Math.floor(loaded / total * 100) + '%');
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
        for (var key in globals.remove.bodies) {
            globals.world.remove(globals.remove.bodies[key]);
            delete globals.remove.bodies[key];
        }
        for (var _key in globals.remove.meshes) {
            globals.scene.remove(globals.remove.meshes[_key]);
            delete globals.remove.meshes[_key];
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

    // Update labels
    for (var _key2 in globals.LABELS) {
        globals.LABELS[_key2]();
    }globals.BODIES['player'].mesh.position.copy(globals.BODIES['player'].body.position);
    if (globals.BODIES['player'].body.velocity.x > 10) globals.BODIES['player'].body.velocity.x = 10;
    if (globals.BODIES['player'].body.velocity.z > 10) globals.BODIES['player'].body.velocity.z = 10;

    $('#health-bar').val(player.hp.val / player.hp.max * 100 > 0 ? player.hp.val / player.hp.max * 100 : 0);
    $('#health').text(player.hp.val > 0 ? player.hp.val : 0 + ' HP');

    globals.world.step(dt);
    globals.controls.update(Date.now() - globals.delta);
    // globals.rendererDEBUG.update();
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

},{"./globals":2,"./multiplayer":10,"./player":11,"./shooting":12}],10:[function(require,module,exports){
'use strict';

module.exports = function (globals, player) {

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

            player.inventory = player.serverdata.acc.inventory;

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
            globals.PLAYERS.push({
                body: cube.body,
                mesh: cube.mesh,
                id: data.id,
                data: data
            });
            globals.label(cube.mesh, data.acc.level + ' - ' + data.acc.username);
        }
    });

    globals.socket.on('removeOtherPlayer', function (data) {

        globals.scene.remove(playerForId(data.id).mesh);
        globals.world.remove(playerForId(data.id).body);
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
            globals.remove.bodies.push(ball.body);
            globals.remove.meshes.push(ball.mesh);
        });
    });

    globals.socket.on('hit', function (data) {
        if (data.id == player.id) player.hp -= data.dmg;
        if (player.hp <= 0) {
            alert('Why excuse me fine sir, but it appears that you are dead!');
            globals.socket.disconnect();
        }
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

    globals.socket.on('clear', function () {
        for (var i = globals.scene.children.length - 1; i >= 0; i--) {
            globals.scene.remove(globals.scene.children[i]);
        }
    });

    globals.socket.on('reload', function () {
        window.location.reload();
    });

    globals.updatePlayerData = updatePlayerData;
    globals.playerForId = playerForId;
};

},{"./init/manager":5}],11:[function(require,module,exports){
"use strict";

module.exports = {
    hp: {
        val: 15,
        max: 15
    }
};

},{}],12:[function(require,module,exports){
'use strict';

/* global THREE, CANNON */

module.exports = function (globals) {

    function getShootDir(targetVec) {
        var projector = new THREE.Projector();
        var vector = targetVec;
        targetVec.set(0, 0, 1);
        projector.unprojectVector(vector, globals.camera);
        var ray = new THREE.Ray(globals.BODIES['player'].body.position, vector.sub(globals.BODIES['player'].body.position).normalize());
        targetVec.copy(ray.direction);
    }

    function shoot(e) {
        if (globals.controls.enabled == true) {
            (function () {

                var shootDirection = new THREE.Vector3();
                var shootVelo = 20;

                var x = globals.BODIES['player'].body.position.x;
                var y = globals.BODIES['player'].body.position.y;
                var z = globals.BODIES['player'].body.position.z;

                var ball = globals.ball({
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
                ball.id = Math.random();

                ball.body.addEventListener("collide", function (event) {
                    // for(let key in event) alert(key);
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

    window.addEventListener('click', shoot);
};

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);
