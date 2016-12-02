/* global $ */

module.exports.init = () => {
    $('#gui').toggle();
    $('#underlay').toggle();
    $('.play-btn').hide();
    $('#gui-exit').click(() => {
        $('#gui').toggle();
        $('#underlay').toggle();
    });
};

module.exports.quests = () => {
    $('#quest-alert > p').text('Getting Skills');
    $('#quest-alert > small').text('Use the Alchemy Table to make a health potion.');
    setTimeout(function () {
        $('#quest-alert').animate({
            'right': '-280px'
        }, 1000);
    }, 5000);
};

module.exports.inventory = player => {
    $('#gui').show();
    $('#underlay').show();
    $('#gui-title').text('Inventory');
    let txt = '';
    for (let item in player.inventory) txt += `<span title='${player.inventory[item].desc}'>${player.inventory[item].name}</span>`;
    $('#gui-content').html(txt);
    if ($('#gui-content').is(':visible')) document.exitPointerLock();
};
