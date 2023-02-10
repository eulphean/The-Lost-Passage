/*
  Name: CameraControl.js
  Author: Amay Kataria
  Date: 09/24/2021
  Description: A module that handles camera and user interaction component.
*/

import * as THREE from 'three'
import * as TWEEN from "@tweenjs/tween.js"
import '../Utilities/Utility'
import oc from 'three-orbit-controls'
import { getRandomNum } from '../Utilities/Utility';
import ExhibitionManager from './ExhibitionManager';

export let OrbitParams = {
    EnableControls: false,
    EnablePan: true,
    AutoRotate: false,
    RotateSpeed: 0.1, 
    EnableKeys: true
};

const zoom = 250; 
let cameraCorners = [
    {x: zoom, y: 0, z: 0},
    {x:-zoom, y: 0, z: 0},
    {x: 50, y: zoom, z: 0},
    {x: 50, y: -zoom, z: 0},
    {x: 0, y: 0, z: zoom}, // Initial camera
    {x:0, y: 0, z: -zoom}
];

const OrbitControls = oc(THREE);  

class CameraControl {
    constructor() {
        // Camera Setup
        // (FOV, AspectRatio, Near Clipping, Far Clipping)
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.05, 20000);
        this.camera.position.set(10000, 7000, 500); 
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.frustumCulled = true; 

        // this.orbitControls = new OrbitControls(this.camera);

        this.mouse = new THREE.Vector2(0, 0);
        this.animationStopped = false;
        this.currentIdx = 4; // Starting position of the camera. 

        // Mouse activites
        this.onMouseMoveBound = this.onMouseMove.bind(this); 
        window.addEventListener('mousemove', this.onMouseMoveBound, false);
        this.num = 0; 
        window.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        ExhibitionManager.subscribe(this.onExhibitionUpdate.bind(this));

    }

    update(scene) {
        // Once the camera animation stopped, return the control back to user
        if (this.animationStopped){
            // Now we need to know how to update the positions. 
            this.cameraUpdates();
        }

        this.camera.lookAt(scene.position);

        let isExhibition = ExhibitionManager.isExhibition; 
        // Start a very simple camera rotation.
        if (isExhibition) {
           this.num += 0.001;
        //    this.camera.position.z = zoom/4 * Math.cos(this.num);
           this.camera.position.y = zoom * Math.sin(this.num);
           this.camera.position.x = zoom * Math.cos(this.num);
        } else {
            TWEEN.update();
        }

        // this.orbitControls.enablePan = OrbitParams.EnablePan;
        // this.orbitControls.enabled = OrbitParams.EnableControls; 
        // this.orbitControls.enableKeys = OrbitParams.EnableKeys;
        // this.orbitControls.enableDamping = true; 
        // this.orbitControls.rotateSpeed = OrbitParams.RotateSpeed;
    }

    onExhibitionUpdate() {
        let isExhibition = ExhibitionManager.isExhibition; 
        if (isExhibition) {
            console.log('Event Remove')
            // Remove mouseMove, click events. 
            window.removeEventListener('mousemove', this.onMouseMoveBound, false);
            window.removeEventListener('click', this.onMouseClickBound, false); 
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX - window.innerWidth / 2) * 0.3;
        this.mouse.y = (event.clientY - window.innerHeight / 2) * 0.7;
    }
    
    onMouseWheel(event) {
        this.zoom += event.deltaY * 0.1;
        // Constrain the zoom within the reasonable range
        this.zoom = Math.min(Math.max(100, this.zoom), 300);
    }

    initialTween(onAnimationComplete) {
        let tween = new TWEEN.Tween(this.camera.position)
        .to(cameraCorners[this.currentIdx], 4000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {
          // Animation has finished. 
          this.animationStopped = true;

          // Now, show the nav panel.
          onAnimationComplete();

          // Hook the event once the animation completes
          this.onMouseClickBound = this.onMouseClick.bind(this);
          //window.addEventListener('click', this.onMouseClickBound, false);
        }); 

        tween.start(); 
    }

    onMouseClick(event) {
        this.calcNewCameraIdx(); 

        // Tween to that location. 
        let tween = new TWEEN.Tween(this.camera.position)
        .to(cameraCorners[this.currentIdx], 4000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {
            // Animation has stopped. 
            this.animationStopped = true; 
        }); 

        tween.start();
        this.animationStopped = false;
    }

    calcNewCameraIdx() {
        let idx = Math.floor(getRandomNum(0, cameraCorners.length));
        while (idx === this.currentIdx) {
            idx = Math.floor(getRandomNum(0, cameraCorners.length)); 
        }

        this.currentIdx = idx; 
    }

    cameraUpdates() {
        switch (this.currentIdx) {
            case 0: {
                this.camera.position.x = zoom;
                this.camera.position.y += (this.mouse.y - this.camera.position.y) * .025;
                this.camera.position.z += (this.mouse.x - this.camera.position.z) * .025;
                break;
            }

            case 1: {
                this.camera.position.x = -zoom;
                this.camera.position.y += (this.mouse.y - this.camera.position.y) * .025;
                this.camera.position.z += (this.mouse.x - this.camera.position.z) * .025;
                break; 
            }

            case 2: {
                this.camera.position.x += (this.mouse.y - this.camera.position.x) * .025;
                this.camera.position.y = zoom; 
                this.camera.position.z += (this.mouse.x - this.camera.position.z) * .025;
                break;
            }

            case 3: {
                this.camera.position.x +=  (this.mouse.x - this.camera.position.x) * .025;
                this.camera.position.y = -zoom; 
                this.camera.position.z += (this.mouse.y - this.camera.position.z) * .025;
                break;
            }

            case 4: {
                this.camera.position.x += (this.mouse.x - this.camera.position.x) * .025;
                this.camera.position.y += (this.mouse.y - this.camera.position.y) * .025; 
                this.camera.position.z = zoom;
                break;
            }

            case 5: {
                this.camera.position.x += (this.mouse.x - this.camera.position.x) * .025;
                this.camera.position.y += (this.mouse.y - this.camera.position.y) * .025; 
                this.camera.position.z = -zoom;
                break;
            }

            default: {
                break; 
            }
        }
    }

    getCamera() {
        return this.camera;
    }
} 

// Keep a singleton instance of this - through App.js
export default CameraControl;