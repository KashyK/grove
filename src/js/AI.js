/* global THREE, CANNON, TWEEN */

let AIS = [];

module.exports = (globals) => {

    // Current Required AIs Include: Wicket, Ferdinand, Nicholas Czerwinski

    class AI {
        constructor(name = '{{ AI CONSTRUCTOR }}', hp = 10, dmg = 10) {
            this.name = name;
            this.hp = hp;
            this.dmg = dmg;
            AIS.push(this);
        }

        update() {} // virtual
    }

    class Animal extends AI {

        constructor(type = 'animal', hp = 3, dmg = 2, hostility = 0) {
            // Hostility: -1 is run away, 0 = neutral, 1 is hostile
            super(type, hp, dmg);
            let loader = new THREE.ObjectLoader();
            this.hostility = hostility;
            loader.load(`/models/${type}/${type}.json`, object => {
                alert(JSON.stringify(object.animations));
                if (type == 'chicken') object.scale.set(5, 5, 5);
                this.body = globals.ball({
                    radius: 1,
                    mass: 15,
                    pos: new THREE.Vector3(Math.random() * 50 - 25, 20, Math.random() * 50 - 25),
                    mesh: object
                });
                setInterval(() => this.update(this.body, this.hostility), 40);
            });
        }

        update(body, hostility) { // que? nothing. kk
            const ppos = globals.BODIES['player'].body.position;
            const bpos = body.body.position;
            if (globals.BODIES['player'].mesh.position.distanceTo(body.mesh.position) < 20) {
                let speed = 10;
                if (hostility < 0) speed *= -1;
                body.body.velocity.set(ppos.x < bpos.x ? -speed : speed, body.body.velocity.y, ppos.z < bpos.z ? -speed : speed);
            }
            else this.body.body.velocity.set(0, body.body.velocity.y, 0);
        }
    }

    // This should be good
    new Animal('rabbit', 3, 0, -1);
    new Animal('rabbit', 3, 0, -1);
    new Animal('rabbit', 3, 0, -1);
    new Animal('rabbit', 3, 0, -1);
    new Animal('rabbit', 3, 0, -1);
    /* new Animal('chicken', 1, 0, -0.5); // Needs to be a bit docile, but also be a bit afraid nt
     new Animal('chicken', 1, 0, -0.5);
     new Animal('chicken', 1, 0, -0.5);*/


};
