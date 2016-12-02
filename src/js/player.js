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
        this.equipped = 'rock';
    }
}

let player = new Player();

window.addEventListener('keydown', e => {
    try {
        if ($(`#hb-${String.fromCharCode(e.keyCode)}`).length) {
            $('.hotbar').removeClass('active');
            $(`#hb-${String.fromCharCode(e.keyCode)}`).addClass('active');
            if ($(`#hb-${String.fromCharCode(e.keyCode)}`).text() !== '-') {
                player.equipped = $(`#hb-${String.fromCharCode(e.keyCode)}`).text().toLowerCase();
            } else player.equipped = null;
        }
        else if (String.fromCharCode(e.keyCode) == 'I') {
            require('./gui').inventory(player);
        }
    }
    catch (err) {}
});

module.exports = player;
