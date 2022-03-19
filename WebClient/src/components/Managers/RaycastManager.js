/*
  Name: RaycastManager.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: Core raycast manager. 
*/

import * as THREE from 'three'

class RaycastManager {
    constructor(shootPigeonCallback) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(); 

        this.shootPigeon = shootPigeonCallback;
        this.isIntersecting = false;  

        // Hook this to the right click mechanism. 
        // Listen for mouse events for raycaster.  
        // window.addEventListener('click', this.onMouseClick.bind(this), false);

        this.clock = new THREE.Clock(); 
    }

    intersect(camera, targetMesh, shouldAnimate) {
        if (shouldAnimate) {
            this.raycaster.setFromCamera(this.mouse, camera);

            // Do we intersect with the target mesh? 
            const objects = this.raycaster.intersectObject(targetMesh); 
            this.isIntersecting = objects.length > 0;
        }
    }

    onMouseClick() {
        // let elapsedTime = this.clock.getDelta(); 
        // if (this.isIntersecting && elapsedTime > COOLDOWN_PERIOD) {
        //     this.shootPigeon();            
        // }
    }
} 

// Keep a singleton instance of this - through App.js
export default RaycastManager;
