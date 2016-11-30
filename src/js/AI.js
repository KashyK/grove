let AIS = [];

class AI {
    constructor(name = '{{ AI CONSTRUCTOR }}', hp = 10, dmg = 10) {
        this.name = name;
        this.hp = hp;
        this.dmg = dmg;
        this.target = null;
        
        this.shape = new THREE.Mesh(
            new THREE.BoxGeometry(5, 40, 5),
            new THREE.MeshLambertMaterial({
                color: 0xFFFFFF
            })
        );
        AIS.push(this);
    }
    update() {
        for (let key in AIS)
            key;
    }
}

module.exports.ai = AI;

var dave = new AI();