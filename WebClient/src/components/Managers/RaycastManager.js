/*
  Name: RaycastManager.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: Core raycast manager. 
*/

import * as THREE from 'three'
import { PatternParams } from './PatternManager';



class RendererManager {
    constructor(shootPigeonCallback) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(); 

        this.callback = shootPigeonCallback;
        this.isIntersecting = false;  

        // Listen for mouse events. 
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('click', this.onMouseClick.bind(this), false);
    }

    onMouseMove(event) {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    intersect(camera, targetMesh) {
        this.raycaster.setFromCamera(this.mouse, camera);
        const objects = this.raycaster.intersectObject(targetMesh); 
        if (objects.length > 0) {
            this.isIntersecting = true;  
        }
    }

    onMouseClick(event) {
        if (this.isIntersecting) {
            this.callback();
        }
    }
} 

// Keep a singleton instance of this - through App.js
export default RendererManager;
