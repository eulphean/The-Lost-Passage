/*
  Name: RaycastManager.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: Core raycast manager. 
*/

import * as THREE from 'three'

const COOLDOWN_PERIOD = 5; // 5 seconds. 
class RaycastManager {
    constructor(shootPigeonCallback) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(); 

        this.shootPigeon = shootPigeonCallback;
        this.isIntersecting = false;  

        // Listen for mouse events for raycaster.  
        window.addEventListener('click', this.onMouseClick.bind(this), false);

        this.clock = new THREE.Clock(); 
    }

    onMouseMove(event) {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
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
        let elapsedTime = this.clock.getDelta(); 
        console.log(elapsedTime);
        if (this.isIntersecting && elapsedTime > COOLDOWN_PERIOD) {
            this.shootPigeon();            
        }
    }
} 

// Keep a singleton instance of this - through App.js
export default RaycastManager;
