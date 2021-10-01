/*
  Name: RendererManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Core renderer manager. 
*/

import * as THREE from 'three'

class RendererManager {
    constructor() {
        // Core renderer. 
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        }); 
        this.renderer.setClearColor('white', 1);    // Set renderer properties
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding; 

        console.log(window.innerWidth);
        console.log(window.innerHeight);

        // this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight); 
        // this.renderer.setScissorTest(true);
    }

    getDomElement() {
        return this.renderer.domElement; 
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
} 

// Keep a singleton instance of this - through App.js
export default RendererManager;
