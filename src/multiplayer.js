/* global socket */

module.exports = (globals, player) => {

    socket.emit('requestOldPlayers', {});

    socket.on('createPlayer', data => {
        if (typeof player.serverdata === 'undefined') {

            player.serverdata = data;
            player.id = data.id;

            player.inventory = player.serverdata.acc.inventory;

        }
    });

    socket.on('addOtherPlayer', data => {
        if (data.id !== player.id) {
            let cube = globals.load.box({
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

    socket.on('removeOtherPlayer', data => {

        globals.scene.remove(playerForId(data.id).mesh);
        globals.world.remove(playerForId(data.id).body);
        console.log(data.id + ' disconnected');

    });

    socket.on('updatePosition', data => {

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

    socket.on('bullet', ({
        pos,
        vel,
    }) => {
      let ball = globals.load.ball({
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


    var updatePlayerData = function () {

        player.serverdata.x = globals.BODIES['player'].body.position.x;
        player.serverdata.y = globals.BODIES['player'].body.position.y;
        player.serverdata.z = globals.BODIES['player'].body.position.z;

        player.serverdata.q = globals.BODIES['player'].body.quaternion;

    };

    var playerForId = id => {
        let index;
        for (let i = 0; i < globals.otherPlayersId.length; i++) {
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