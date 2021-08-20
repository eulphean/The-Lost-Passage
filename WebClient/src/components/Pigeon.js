/*
  Author: Amay Kataria
  Date: 08/19/2021
  Title: Pigeon.js
  Description: Pigeon class that extends the agent class. It loads the bird model 
  and executes high level animations, etc. 
*/

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Agent from './Agent.js'
import model from '../models/Bird_simple.glb'; 
import * as Utility from './Utility';

const loader = new GLTFLoader(); 

export default class Pigeon extends Agent {
    constructor(scene) {
        super();
        this.loadPigeon(scene); 
    }

    loadPigeon(scene) {
        loader.load(model, gltf => {
            this.pigeon = gltf.scene; 
            
            // Agent is the parent object under which pigeon sits. 
            this.agent = new THREE.Group();
            this.agent.add(this.pigeon); 
            this.agent.frustumCulled = false;
            this.agent.castShadow = true;
            this.agent.receiveShadow = true; 

            // Store all the parameters that we'll be changing for this agent. 
            this.agentPosition = this.agent.position; 
            this.agentRotation = this.agent.rotation; 
            this.agentScale = this.agent.scale; 
            this.agentAnimations = gltf.animations; 

            // Setup animation. 
            this.animationMixer = new THREE.AnimationMixer(this.agent); 
            var action = this.animationMixer.clipAction(this.agentAnimations[0]);
            action.play(); 

            // Add it to the scene. 
            scene.add(this.agent); 
        }, undefined, function ( error ) {
            console.error(error);
        }); 
    }

    update(delta) {
        // Animation update. 
        if (this.animationMixer) {
            this.animationMixer.update(delta);

            // Behaviors. 
            this.updateAgent();  

            // Sync rotation and position. 
            this.syncPosition();
            //this.syncRotation(); 
        }
    }

    syncPosition() {
        // Sync position of the agent with 
        // the actual agent scene. 
        this.agent.position.copy(this.position);
    }

    syncRotation() {
        // Agent rotation.
        let azimuth, inclination; 
        azimuth = Utility.azimuth(this.velocity); 
        inclination = Utility.inclination(this.velocity);

        Utility.axisRotation(0, 0, 1, azimuth - Math.PI/2, this.rotationA); 
        Utility.axisRotation(1, 0, 0, Math.PI/2 - inclination, this.rotationB); 
                    
        this.rotationA.multiply(this.rotationB);
        this.agent.setRotationFromQuaternion(this.rotationA);
    }
}


