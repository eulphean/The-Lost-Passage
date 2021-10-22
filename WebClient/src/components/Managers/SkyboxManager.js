/*
  Name: SkyboxManager.js
  Author: Amay Kataria
  Date: 10/19/2021
  Description: Core Skybox Manager that does everything related to the skybox. 
*/

import * as THREE from 'three'

// Create some parameters here for the User Interface. 

export let SkyboxParams = {

    ShowSkybox: true,
    ShowBoundingBox: true,
    BoundingBoxScalar: 0 // Control the size of the bounding box using this scalar. 
}

class SkyboxManager {
    constructor(scene) {
        const geometry = new THREE.BoxGeometry(400, 400, 400);
        const material = new THREE.MeshBasicMaterial({side: THREE.BackSide});

        // Reuse this variable in other parts. 
        this.cubeMesh = new THREE.Mesh(geometry, material);
        scene.add(this.cubeMesh);

        this.createBoundingBox(scene); 
        this.lastBoundingBoxScalar = SkyboxParams.BoundingBoxScalar; 
    }

    setupVideoTexture(skyboxVideoRef) {
        const texture = new THREE.VideoTexture(skyboxVideoRef.current);
        this.cubeMesh.material.map = texture;
    }

    createBoundingBox(scene) {
        // Computer a bounding box from the Skybox geometry. 
        this.cubeMesh.geometry.computeBoundingBox();

        // Extract and update the THREE.Box3 bounding box from it. 
        this.boundingBox = this.cubeMesh.geometry.boundingBox;
        this.boundingBox.expandByScalar(SkyboxParams.BoundingBoxScalar); // Set how much scale down you want. 
        
        // This is the red mesh that you see on the screen, which is added to the scene for the Bounding Box
        this.boundingBoxMesh = new THREE.BoxHelper(this.cubeMesh, new THREE.Color(1, 0, 0));
        this.boundingBoxMesh.visible = SkyboxParams.ShowBoundingBox;
        scene.add(this.boundingBoxMesh); 
    }

    getBoundingBox() {
        // This returns boundingBox of type THREE.Box3. It's the true BoundingBox. 
        // You can run helper functions like intersects, isPointInside, etc on this. 
        if (this.boundingBox) {
            return this.boundingBox; 
        }
    }

    update() {
        this.cubeMesh.visible = SkyboxParams.ShowSkybox;
        this.boundingBoxMesh.visible = SkyboxParams.ShowBoundingBox; 

        // Has BoundedBox Scalar changed?
        // Update the bounded box! 
        if (SkyboxParams.BoundingBoxScalar !== this.lastBoundingBoxScalar) {
            this.updateBoundingBox(); 
            this.lastBoundingBoxScalar = SkyboxParams.BoundingBoxScalar; 
        }
    }

    updateBoundingBox() {
        // Create a new bounding box from original bbMesh.
        this.cubeMesh.geometry.computeBoundingBox();
        this.boundingBox = this.cubeMesh.geometry.boundingBox;
        this.boundingBox.expandByScalar(SkyboxParams.BoundingBoxScalar); // Set how much scale down you want. 

        // Update the bounding box mesh on the screen with respect to bbMesh. 
        this.boundingBoxMesh.update(this.cubeMesh); 
    }
} 

export default SkyboxManager;