module.exports = (globals, player) => {
    
    $(window).bind("online", () => require('./gui')('Online', 'Connection restored')); 
    $(window).bind("offline", () => require('./gui')('Offline', 'Connection lost'));

    globals.socket.emit('client-credentials', {
        username: window.__D.username,
        password: window.__D.password
    });

    window.__D = undefined;
    delete window.__D;

    globals.socket.emit('requestOldPlayers', {});

    globals.socket.on('createPlayer', data => {
        if (typeof player.serverdata === 'undefined') {

            player.serverdata = data;
            player.id = data.id;

            player.inventory = player.serverdata.acc.inventory;

            require('./init/manager')(globals, player);

        }
    });

    globals.socket.on('addOtherPlayer', data => {
        if (data.id !== player.id) {
            let cube = globals.box({
                l: 1,
                w: 1,
                h: 2,
                mass: 0
            });
            globals.PLAYERS.push({
                body: cube.body,
                mesh: cube.mesh,
                id: data.id,
                data
            });
            globals.label(cube.mesh, data.acc.level + ' - ' + data.acc.username);
        }
    });

    globals.socket.on('removeOtherPlayer', data => {

        globals.scene.remove(playerForId(data.id).mesh);
        globals.world.remove(playerForId(data.id).body);
        console.log(data.id + ' disconnected');

    });

    globals.socket.on('updatePosition', data => {

        let somePlayer = playerForId(data.id);
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

    globals.socket.on('bullet', ({
        pos,
        vel,
    }) => {
        let ball = globals.ball({
            array: 'projectiles'
        });
        ball.body.position.set(pos.x, pos.y, pos.z);
        ball.body.velocity.set(vel.x, vel.y, vel.z);
        ball.mesh.position.set(pos.x, pos.y, pos.z);

        ball.body.addEventListener("collide", event => {
            setTimeout(() => {
                globals.remove.bodies.push(ball.body);
                globals.remove.meshes.push(ball.mesh);
            }, 1500);
        });
    });

    globals.socket.on('hit', data => {
        if (data.id == player.id) player.hp.val--;
        if (player.hp.val <= 0) {
            alert('Why excuse me fine sir, but it appears that you are dead!');
            globals.socket.disconnect();
        }
    });


    var updatePlayerData = function() {

        player.serverdata.x = globals.BODIES['player'].body.position.x;
        player.serverdata.y = globals.BODIES['player'].body.position.y;
        player.serverdata.z = globals.BODIES['player'].body.position.z;

        player.serverdata.q = globals.BODIES['player'].body.quaternion;

    };

    var playerForId = id => {
        let index;
        for (let i = 0; i < globals.PLAYERS.length; i++) {
            if (globals.PLAYERS[i].id == id) {
                index = i;
                break;
            }
        }
        return globals.PLAYERS[index];
    };

    globals.socket.on('clear', () => {
        for (var i = globals.scene.children.length - 1; i >= 0; i--) {
            globals.scene.remove(globals.scene.children[i]);
        }
    });

    globals.socket.on('reload', () => window.location.reload());

    globals.updatePlayerData = updatePlayerData;
    globals.playerForId = playerForId;

};
