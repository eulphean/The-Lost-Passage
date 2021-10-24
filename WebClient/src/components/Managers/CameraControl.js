/*
  Name: CameraControl.js
  Author: Amay Kataria
  Date: 09/24/2021
  Description: A module that handles camera and user interaction component.
*/

import * as THREE from 'three'
import oc from 'three-orbit-controls'

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
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.05, 20000);
        this.camera.position.set(0, 0, 500); 
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.frustumCulled = false; 

        // this.controls = new OrbitControls(this.camera); 
    }

    update(scene, mouse, zoom) {
        this.camera.position.x += ( mouse.x - this.camera.position.x ) * .05;
        this.camera.position.y += ( - mouse.y - this.camera.position.y ) * .05;
        this.camera.position.z = zoom;

        this.camera.lookAt( scene.position );
        // this.updateControls();
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