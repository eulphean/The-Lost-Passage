import * as THREE from 'three';

export default class Target {
    constructor(scene) {
        let geometry = new THREE.SphereGeometry(5, 12, 12);
        let material = new THREE.MeshLambertMaterial(); 
        material.emissive = new THREE.Color('#ffffff');
        material.wireframe = false;
        material.transparent = false; 
        // material.opacity = 0.5; 
        this.mesh = new THREE.Mesh(geometry, material);

        scene.add(this.mesh);
    }

    getVector() {
        return this.mesh.position; 
    }

    setVector(v) {
        this.mesh.position.copy(v);
    }

    setVisibility(v) {
        this.mesh.visible = v;
    }
}