/* global $ */


let ProtoTree = require('rpg-tools/lib/ProtoTree'),
    pt = null;

const base = require('./json/base'),
    weapons = require('./json/weapons'),
    materials = require('./json/mats');

Object.assign(base, weapons, materials);
pt = new ProtoTree(base);

module.exports = callback => {
    callback(pt, setUpComponent, setUpSword);
};

function setUpComponent(comp, mat) {
    let c = pt.get(comp),
        m = pt.get(mat);
    c.mat = m;
    c.dmg = m.dmg;
    c.spd = m.spd;
    c.dur = m.dur;
    c.name = m.name + c.name;
    return c;
}

function setUpSword(type, mat1, mat2) {
    let sword = pt.get(type ? 'longsword' : 'shortsword'),
        blade = setUpComponent('@blade', mat1),
        handle = setUpComponent('@handle', mat2);
    sword.blade = blade;
    sword.handle = handle;
    sword.name = `${blade.mat.name} ${sword.name}`;
    sword.dmg = (blade.dmg + handle.dmg) / 2;
    sword.spd = (blade.spd + handle.spd) / 2;
    return sword;
}
