/* global TWEEN */

let AIS = [];

module.exports = () => {

    // Current Required AIs Include: Wicket, Ferdinand, Nicholas Czerwinski

    class AI {
        constructor(name = '{{ AI CONSTRUCTOR }}', hp = 10, dmg = 10) {
            this.name = name;
            this.hp = hp;
            this.dmg = dmg;
            AIS.push(this);
        }
        update() {
            TWEEN;
        }
    }
    // EMOGICONS ARE PEOPLE DOS (to)


    class Villager extends AI {
        constructor(name = 'Bob the Villager', hp = 10, dmg = 0) { // these are default vals
            super(name, hp, dmg);
        }
    }
    //ASIANS ARE PEOPLE TO

    class Wicket extends AI {
        constructor(name = 'Wicket', hp = Infinity, dmg = 2) {
            super(name, hp, dmg);
        }
    }

    //A Tribute to Mr. C
    class Nicholas extends AI {
        constructor(name = 'Nicholas Czerwinski', hp = 100000, dmg = Infinity, godLikePowers = "Controlling EVERYTHING (except his students)") {
            super(name, hp, dmg);
            this.godLikePowers = godLikePowers;
        }
    }

    module.exports.ai = AI;
    module.exports.villager = Villager;
    module.exports.wicket = Wicket;
    module.exports.nicholas = Nicholas;
};
