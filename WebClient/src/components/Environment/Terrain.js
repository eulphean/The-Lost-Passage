/*
  Author: Amay Kataria
  Date: 09/16/2021
  Title: Terrain.js
  Description: A class responsible to load the static terrain. This the natural landscape that 
  we bring in from Blender. 
*/

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import terrain from '../../models/world.glb'; 


const loader = new GLTFLoader(); 

export default class Terrain {
    constructor(scene) {
        this.loadTerrain(scene); 
    }

    loadTerrain(scene) {
        loader.load(terrain, gltf => {
            this.terrain = gltf.scene; 
            
            // Agent is the parent object under which pigeon sits. 
            this.parent = new THREE.Group();
            this.parent.add(this.terrain); 
            this.parent.frustumCulled = false;
            this.parent.castShadow = true;
            this.parent.receiveShadow = true; 

            // Store all the parameters that we'll be changing for this agent. 
            this.terrainPosition = this.parent.position; 
            this.terrainRotation = this.parent.rotation; 
            this.terrainScale = this.parent.scale

            this.terrainScale.set(100, 100, 100);

            // Add it to the scene. 
            scene.add(this.parent); 
        }, undefined, function ( error ) {
            console.error(error);
        }); 
    }

    getMesh() {
        return this.parent;
    }
}


