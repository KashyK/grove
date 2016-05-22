function Plant(o) {
    this.shape = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({}));
    this.harvest = function (o) {
        return o;
    };
    //
    var _loader = new THREE.ObjectLoader();
    var self = this;
    _loader.load('/img/plants/' + o.name + '/ripe.json', function (obj) {
        scene.add(obj);
        objects.push(obj);
        obj.scale.set(4, 4, 4);
        for (var key in obj.children) {
            objects.push(obj.children[key]);
            obj.children[key].callback = function () {
                self.harvest(o);
                obj.visible = false;
                scene.remove(obj);
                player.inventory.push(o.name);
            };
        }
        obj.position.set(o.x, o.y, o.z);
    });
}