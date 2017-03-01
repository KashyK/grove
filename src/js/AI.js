/* global THREE, TWEEN */

let AIS = [];

module.exports = (globals) => {

    // Current Required AIs Include: Wicket, Ferdinand, Nicholas Czerwinski

    class AI {
        constructor(name = '{{ AI CONSTRUCTOR }}', hp = 10, dmg = 10) {
            this.name = name;
            this.hp = hp;
            this.dmg = dmg;
            this.target = new THREE.Vector3(0, 20, 0);
            this.body = globals.ball({
                radius: 1,
                mass: 5,
                pos: this.target
            });
            globals.scene.add(this.body.mesh);
            let tween = new TWEEN.Tween(this.body.body.position)
                .to(globals.BODIES['player'].body.position, 1000)
                .start();
            globals.TWEENS.push(tween);
            AIS.push(this);
        }
        update() {}
    }

    class Villager extends AI {
        constructor(name = 'Bob the Villager', hp = 10, dmg = 0) { // these are default vals
            super(name, hp, dmg);
        }
    }

    const test = new Villager('Jason');

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
