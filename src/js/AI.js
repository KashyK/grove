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
            loader.load(`/models/rabbit/rabbit.json`, object => {
                this.target = new THREE.Vector3(0, 20, 0);
                this.body = globals.ball({
                    radius: 1,
                    mass: 15,
                    pos: this.target,
                    mesh: object
                });
                setInterval(() => this.update(this.body), 40);
            });
            this.hostility = hostility;
        }

        update(body) {
            const ppos = globals.BODIES['player'].body.position;
            const bpos = body.body.position;
            if (globals.BODIES['player'].mesh.position.distanceTo(body.mesh.position) < 20)
                body.body.velocity.set(ppos.x < bpos.x ? -10 : 10, body.body.velocity.y, ppos.z < bpos.z ? -10 : 10);
            else this.body.body.velocity.set(0, body.body.velocity.y, 0);
        }
    }

    const rabbit = new Animal('rabbit', 3, 0, -1);

    const duck = new Animal('duck', 3, 0, -0.5); // Needs to be a bit docile, but also be a bit afraid

};
