/*
  Name: RendererManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Core renderer manager. 
*/

import * as THREE from 'three'

export let RendererParams = {
    DrawCalls: 0
}

class RendererManager {
    constructor() {
        // Core renderer. 
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        }); 
        //this.renderer.setClearColor('white', 1);    // Set renderer properties
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding; 
    }

    setAnimationLoop(animate) {
        this.renderer.setAnimationLoop(animate);
    }

    getDomElement() {
        return this.renderer.domElement; 
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }

    updateSize(width, height) {
        this.renderer.setSize(width, height); 
    }

    monitorDrawCalls() {
        RendererParams.DrawCalls = this.renderer.info.render.calls;
    }
} 

// Keep a singleton instance of this - through App.js
export default RendererManager;
