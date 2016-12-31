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
        this.equipped = null;
    }
}

let player = new Player();

window.addEventListener('keydown', e => {
    try {
        if ($(`#hb-${String.fromCharCode(e.keyCode)}`).length) {
            $('.hotbar').removeClass('active');
            $(`#hb-${String.fromCharCode(e.keyCode)}`).addClass('active');
            if ($(`#hb-${String.fromCharCode(e.keyCode)}`).text() !== '-')
                player.equipped = $(`#hb-${String.fromCharCode(e.keyCode)}`).text().toLowerCase();
            else player.equipped = null;
        }
        else if (String.fromCharCode(e.keyCode) == 'Q') {
            require('./gui').stats(player);
        }
    }
    catch (err) {}
});

if ($('#hb-1').text() !== '-')
    player.equipped = $('#hb-1').text().toLowerCase();
else player.equipped = null;

module.exports = player;
