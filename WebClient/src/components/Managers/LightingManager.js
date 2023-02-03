/*
  Name: LightingManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Lighting module to control all the lights in the world. 
*/

import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import clouds from '../../assets/golf2.hdr'

// Note: Removing the lights from here and just using a HDRI to give it natural lighting. 
const hdrLoader = new RGBELoader();
class LightingManager {
    constructor(scene) {
      // Lights
      // const hemiLight = new THREE.HemisphereLight(0xe6ffff, 0xffffff, 2.0);
      // hemiLight.color.setHSL(0.6, 1, 0.6);
      // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      // hemiLight.position.set(0, 50, 0);
      // scene.add(hemiLight);

      // const dirLight = new THREE.DirectionalLight(0x00ace6, 0.8);
      // dirLight.color.setHSL( 0.1, 1, 0.95 );
      // dirLight.position.set( - 1, 1.75, 1 );
      // dirLight.position.multiplyScalar( 30 );
      // scene.add(dirLight);

      // const envMap = hdrLoader.load(hdr, )
      hdrLoader.load(clouds, (envMap) => {
        envMap.mapping = THREE.EquirectangularRefractionMapping;
				//scene.add( env );
        scene.environment = envMap; 
      });
    }
} 

export default LightingManager;