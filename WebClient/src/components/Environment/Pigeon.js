/*
  Author: Amay Kataria
  Date: 08/19/2021
  Title: Pigeon.js
  Description: Pigeon class that extends the agent class. It loads the bird model 
  and executes high level animations, etc. 
*/

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Agent, { AgentParams } from '../Environment/Agent.js'
import model from '../../models/pigeon_back.glb'; 
import * as Utility from '../Utilities/Utility';

const loader = new GLTFLoader(); 

export default class Pigeon extends Agent {
    constructor(scene) {
        super();
        this.loadPigeon(scene); 
    }

    loadPigeon(scene) {
        loader.load(model, gltf => {
            this.pigeon = gltf.scene; 

            this.pigeon.name = 'pChild';
            
            // Agent is the parent object under which pigeon sits. 
            this.parent = new THREE.Group();
            this.parent.add(this.pigeon); 
            this.parent.frustumCulled = false;
            this.parent.castShadow = true;
            this.parent.receiveShadow = true; 
            this.parent.name = 'pigeon';

            // Store all the parameters that we'll be changing for this agent. 
            this.agentPosition = this.parent.position; 
            this.agentRotation = this.parent.rotation; 
            this.agentScale = this.parent.scale
            this.agentAnimations = gltf.animations; 

            this.agentScale.set(0.025, 0.025, 0.025); 

            // Setup animation. 
            this.animationMixer = new THREE.AnimationMixer(this.parent); 
            var action = this.animationMixer.clipAction(this.agentAnimations[0]);
            this.randSeed = Utility.getRandomNum(0.3, 0.8); 
            action.play(); 

            // Add it to the scene. 
            scene.add(this.parent); 
        }, undefined, function ( error ) {
            console.error(error);
        }); 
    }

    update(delta, nAgents) {
        // Animation update. 
        if (this.animationMixer) {

            // Reset steering force. It will accumulate over each behaviour function call 
            this.fSteer.set(0, 0, 0);

            if (this.isAlive){
                // Behaviors. 
                this.updateBehaviour(nAgents);  
            }

            // Gravity pulls agent downwards
            this.fSteer.add(AgentParams.Gravity);

            // Apply steering force
            this.applyForce();

            if (this.isAlive) {
                // Animating flipping wings
                this.animationMixer.update(delta); //  * this.acceleration.lengthSq() * 0.15
            }

            if (!this.isAlive && this.position.y < 0){
                // Don't update dead agents if they are already on the ground
                return  
            }

            // Sync rotation and position. 
            this.updatePosition();
            this.syncPosition();
            this.syncRotation(); 
        }
    }

    syncPosition() {
        // Sync position of the agent with 
        // the actual agent scene. 
        this.parent.position.copy(this.position);
    }

    syncRotation() {
        // // Agent rotation.
        let azimuth, inclination; 
        azimuth = Utility.azimuth(this.velocity); 
        inclination = Utility.inclination(this.velocity);

        Utility.axisRotation(0, 1, 0, azimuth, this.rotationA); // Azimuth rotate around Z-axis
        Utility.axisRotation(0, 0, 1, inclination - Math.PI/2, this.rotationB); // Inclination rotate X-axis
                    
        this.rotationA.multiply(this.rotationB);
        this.parent.setRotationFromQuaternion(this.rotationA);
    }
}


