/*
  Name: LightingManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Lighting module to control all the lights in the world. 
*/

import * as THREE from 'three'

class LightingManager {
    constructor(scene) {
        // -------- Lighting ----------------
        // var ambientLight = new THREE.AmbientLight(0xD7D3D3);
        // ambientLight.intensity = 0.5;
        //this.scene.add(ambientLight);
        
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.intensity = 2.0;
        directionalLight.position.set(0, 100, 100).normalize();
        scene.add(directionalLight);	
    }
} 

export default LightingManager;