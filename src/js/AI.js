/* global THREE, CANNON, TWEEN */

let AIS = [];

module.exports = (globals) => {

    // Current Required AIs Include: Wicket, Ferdinand, Nicholas Czerwinski

    let body;

    class AI {
        constructor(name = '{{ AI CONSTRUCTOR }}', hp = 10, dmg = 10) {
            this.name = name;
            this.hp = hp;
            this.dmg = dmg;
            this.target = new THREE.Vector3(0, 20, 0);
            this.body = globals.ball({
                radius: 1,
                mass: 15,
                pos: this.target
            });
            globals.scene.add(this.body.mesh);
            body = this.body;
            AIS.push(this);
        }
        update() {
            const ppos = globals.BODIES['player'].body.position;
            const bpos = body.body.position;
            const worldPoint = new CANNON.Vec3(0, 0, 0);
            const force = new CANNON.Vec3(ppos.x < bpos.x ? 20 : -20, 0, ppos.z < bpos.z ? 20 : -20);
            body.body.applyForce(force, worldPoint);
        }
    }

    class Villager extends AI {
        constructor(name = 'Bob the Villager', hp = 10, dmg = 0) { // these are default vals
            super(name, hp, dmg);
        }
    }

    const test = new Villager('Jason');
    setInterval(test.update, 40);

    class Wicket extends AI {
        constructor(name = 'Wicket', hp = Infinity, dmg = 2) {
            super(name, hp, dmg);
        }
    }

    class Nicholas extends AI {
        constructor(name = 'Nicholas Czerwinski', hp = 100000, dmg = Infinity, godLikePowers = "Controlling EVERYTHING (except his students)") {
            super(name, hp, dmg);
            this.godLikePowers = godLikePowers;
        }
    }

};
