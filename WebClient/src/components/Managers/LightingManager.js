/*
  Name: LightingManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Lighting module to control all the lights in the world. 
*/

import * as THREE from 'three'

class LightingManager {
    constructor(scene) {
      // Lights
      const hemiLight = new THREE.HemisphereLight(0xffdeff, 0xffffff, 1.6);
      hemiLight.color.setHSL(0.6, 1, 0.6);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      hemiLight.position.set(0, 50, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0x00CED1, 0.6);
      dirLight.color.setHSL( 0.1, 1, 0.95 );
      dirLight.position.set( - 1, 1.75, 1 );
      dirLight.position.multiplyScalar( 30 );
      scene.add(dirLight);
    }
} 

export default LightingManager;