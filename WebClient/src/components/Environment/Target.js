import * as THREE from 'three';

export let TargetParams = {
    ShowTarget: false,
    MaxTargetRadius: 150.0,
    CurrentTargetRadius: 0
}

export default class Target {
    constructor(scene) {
        let geometry, material; 
        
        geometry = new THREE.SphereGeometry(1, 12, 12);
        geometry.position = new THREE.Vector3(0, 0, 0)
        
        material = new THREE.MeshLambertMaterial(); 
        material.emissive = new THREE.Color('#FF0000');
        material.wireframe = false;
        material.transparent = true; 
        material.opacity = 0.5; 
        this.mesh = new THREE.Mesh(geometry, material);

        scene.add(this.mesh);
    }

    update(targetPosition, now) {
        // Set mesh visibility.
        this.setVector(targetPosition);
        this.setVisibility(TargetParams.ShowTarget);

        let scale = TargetParams.MaxTargetRadius + Math.sin(now * 0.001) * TargetParams.MaxTargetRadius / 3; 
        this.mesh.scale.set(scale, scale, scale);
        
        // Changing radius show it in the GUI. 
        TargetParams.CurrentTargetRadius = scale; 
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