'use strict';

function get(url, callback) {
    require('https').get(url, res => {
        let body = '';

        res.on('data', chunk => body += chunk);

        res.on('end', () => {
            let r = JSON.parse(body);
            callback(r);
        });
    }).on('error', e => console.log(`Got an error: ${e}`));
}

get('https://grove.nanoscaleapi.io/spells.json', res => module.exports.spells = res);

get('https://grove.nanoscaleapi.io/weapons.json', res => module.exports.weapons = res);