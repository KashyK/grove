/* global $ */

module.exports = (title, content) => {
    $('#quest-alert').css('right', '0px');
    $('#quest-alert > p').text(title);
    $('#quest-alert > small').text(content);
    setTimeout(() => {
        $('#quest-alert').animate({
            'right': '-280px'
        }, 1000);
    }, 5000);
};

module.exports.init = () => {
    $('#gui').toggle();
    $('#underlay').toggle();
    $('#load-play-btn').hide();
    $('#gui-exit').click(() => {
        $('#gui').toggle();
        $('#underlay').toggle();
    });
};

module.exports.quests = () => {
    $('#quest-alert > p').text('Getting Skills');
    $('#quest-alert > small').text('Use the Alchemy Table to make a health potion.');
    setTimeout(() => {
        $('#quest-alert').animate({
            'right': '-280px'
        }, 1000);
    }, 10000);
};

module.exports.hotbar = player => {
    for (let i = 0; i < 8; i++) $(`#hb-${i}`).html('-');
    for (let i = 0; i < player.hotbar.length; i++) {
        $(`#hb-${i+1}`)
            .text(player.hotbar[i].name)
            .data('item', player.hotbar[i]);
    }
};

module.exports.stats = player => {

    $('#gui').show();
    $('#underlay').show();
    $('#gui-title').text('');
    $('#gui-content').html(`<h1 style=margin-top:21.5%;text-align:center;width:90%;color:white>
    <span id=gui-q>quests</span> | <span id=gui-i>inventory</span> | <span id=gui-m>map</span> | <span id=gui-p>player</span>
    </h1>`);

    //

    $('#gui-q').click(() => {
        $('#gui-title').html('Quests');
        $('#gui-content').html('questy stuff');
    });
    $('#gui-i').click(() => {
        $('#gui-title').html('Inventory');
        $('#gui-content').html('');
        for (let key in player.inventory) {
            $(document.createElement('span'))
                .html(player.inventory[key].name)
                .click((e) => {
                    if (player.hotbar.indexOf(player.inventory[key]) == -1) {
                        player.hotbar.push(player.inventory[key]);
                        module.exports.hotbar(player);
                        $(e.target).css('background-color', 'blue');
                    }
                    else {
                        player.hotbar.splice(player.hotbar.indexOf(player.inventory[key]), 1);
                        module.exports.hotbar(player);
                        $(e.target).css('background-color', 'transparent');
                    }
                })
                .css('background-color', player.hotbar.indexOf(player.inventory[key]) == 0 ? 'blue' : 'transparent')
                .appendTo($('#gui-content'));
        }
    });
    $('#gui-m').click(() => {
        $('#gui-title').html('Map');
        const strMime = "image/jpeg";
        const imgData = require('./globals').renderer.domElement.toDataURL(strMime);
        $('#gui-content').html(`<img src=${imgData} width=200>`);
    });
    $('#gui-p').click(() => {
        $('#gui-title').html('Player');
        $('#gui-content').html('ur stats');
    });
    if ($('#gui-content').is(':visible')) document.exitPointerLock();

};
