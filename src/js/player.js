/* global $ */

class Player {
    constructor() {
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
        
        require('./items')((pt, comp, sword) => {
            let s = sword(0, 'iron', 'wood');
            s.slot = 'weapon';
            this.inventory.push(s);
        });
        
    }
}

let player = new Player();

module.exports = player;
