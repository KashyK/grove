/* global $ */

$('#gui').hide();

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
    $('#gui').toggle();
    $('#blocker').toggle();
    $('#gui-title').text('Inventory');
};
