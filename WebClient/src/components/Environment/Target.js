import * as THREE from 'three';

export let TargetParams = {
    ShowTarget: true,
    MaxTargetRadius: 50.0,
    CurrentTargetRadius: 0
}

export default class Target {
    constructor(scene) {
        let geometry = new THREE.SphereGeometry(1, 12, 12);
        let material = new THREE.MeshLambertMaterial(); 
        material.emissive = new THREE.Color('#FF0000');
        material.wireframe = false;
        material.transparent = true; 
        material.opacity = 0.5; 
        this.mesh = new THREE.Mesh(geometry, material);

        scene.add(this.mesh);

        // geometry = new THREE.SphereGeometry(1, 100, 100);
        // geometry.position = new THREE.Vector3(0, 0, 0);
        // geometry.scale (10, 10, 10);
        // material = new THREE.MeshLambertMaterial(); 
        // material.emissive = new THREE.Color('#FF0000');
        // material.wireframe = false;
        // let newMesh  = new THREE.Mesh(geometry, material);

        // scene.add(newMesh);
    }

    update(targetPosition, now) {
        this.setVector(targetPosition);
        this.setVisibility(TargetParams.ShowTarget);
        // let scale = TargetParams.MaxTargetRadius + Math.sin(now * 0.001) * TargetParams.MaxTargetRadius / 3.0; 
        let scale = TargetParams.MaxTargetRadius;
        this.mesh.scale.set(scale, scale, scale);
        // TargetParams.CurrentTargetRadius = scale; 
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