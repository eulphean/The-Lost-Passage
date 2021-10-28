/*
  Name: SkyboxManager.js
  Author: Amay Kataria
  Date: 10/19/2021
  Description: Core Skybox Manager that does everything related to the skybox. 
*/

import * as THREE from 'three'

// User interface Params
export let SkyboxParams = {
    ShowSkybox: true,
    ShowBoundingBox: true,
    BoundingBoxScalar: 0 // Control the size of the bounding box using this scalar. 
}

export let IsSkyboxReady = false; 

class SkyboxManager {
    createSkybox(scene, frontVideoRef, backVideoRef, leftVideoRef, rightVideoRef, topVideoRef, bottomVideoRef) {
        // Create video textures. 
        const rightTexture = new THREE.VideoTexture(rightVideoRef.current);
        const leftTexture = new THREE.VideoTexture(leftVideoRef.current);
        const topTexture = new THREE.VideoTexture(topVideoRef.current);
        const bottomTexture = new THREE.VideoTexture(bottomVideoRef.current);
        const backTexture = new THREE.VideoTexture(backVideoRef.current);
        const frontTexture = new THREE.VideoTexture(frontVideoRef.current);
        
        // [right, left, top, bottom, back, front] - DO NOT CHANGE THE ARRAY ORDER. 
        let textureArray = [rightTexture, leftTexture, topTexture, bottomTexture, backTexture, frontTexture];
        let materialArray = textureArray.map(t => {
            return new THREE.MeshBasicMaterial({
                map: t,
                side: THREE.BackSide
            }); 
        });

        // Reuse this variable in other parts.
        const geometry = new THREE.BoxGeometry(1200, 1200, 1200); 

        // Material array is automatically arranged to the faces. 
        this.cubeMesh = new THREE.Mesh(geometry, materialArray);
        scene.add(this.cubeMesh);
        
        this.createBoundingBox(scene); 
        this.lastBoundingBoxScalar = SkyboxParams.BoundingBoxScalar; 

        // Skybox is ready. 
        IsSkyboxReady = true; 
        console.log('Skybox Ready.')
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