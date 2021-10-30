/*
  Name: CameraControl.js
  Author: Amay Kataria
  Date: 09/24/2021
  Description: A module that handles camera and user interaction component.
*/

import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as TWEEN from "@tweenjs/tween.js"

const OrbitControls = oc(THREE); 

export let OrbitParams = {
    EnableControls: false,
    EnablePan: true,
    AutoRotate: false,
    RotateSpeed: 0.1, 
    EnableKeys: true
};

class CameraControl {
    constructor() {
        // Camera Setup
        // (FOV, AspectRatio, Near Clipping, Far Clipping)
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 20000);
        this.camera.position.set(10000, 7000, 500); 
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.frustumCulled = true; 

        this.mouse = new THREE.Vector2(0, 0);
        this.zoom = 250;

        this.controls = new OrbitControls(this.camera); 
        this.animationStopped = false;

        // Mouse activites
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('wheel', this.onMouseWheel.bind(this), false);
    }

    update(scene) {
        // Once the camera animation stopped, return the control back to user
        if (this.animationStopped){
            this.camera.position.x += (this.mouse.x - this.camera.position.x ) * .05;
            this.camera.position.y += (- this.mouse.y - this.camera.position.y ) * .05;
            this.camera.position.z = this.zoom;
        }

        this.camera.lookAt(scene.position);

        TWEEN.update();
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX - window.innerWidth / 2) * 0.4;
        this.mouse.y = (event.clientY - window.innerHeight / 2) * 0.8;
    }
    
    onMouseWheel(event) {
        this.zoom += event.deltaY * 0.1;
        // Constrain the zoom within the reasonable range
        this.zoom = Math.min(Math.max(100, this.zoom), 400);
    }

    initialTween(onAnimationComplete) {
        let tween = new TWEEN.Tween(this.camera.position)
        .to({x:0, y:0, z:this.zoom}, 4000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {
          // Animation has finished. 
          this.animationStopped = true;
          // Now, show the nav panel.
          onAnimationComplete();
        }); 

        tween.start(); 
    }

    updateControls() {
        this.controls.update();
        this.controls.enablePan = OrbitParams.EnablePan;
        this.controls.autoRotate = OrbitParams.AutoRotate; 
        this.controls.autoRotateSpeed = OrbitParams.RotateSpeed;
        this.controls.enabled = OrbitParams.EnableControls; 
        this.controls.enableKeys = OrbitParams.EnableKeys;
    }

    getCamera() {
        return this.camera;
    }
} 

// Keep a singleton instance of this - through App.js
export default CameraControl;