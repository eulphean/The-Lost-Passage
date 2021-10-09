    /*
  Name: PigeonManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Container class that manages all the pigeons that are created in the world. 
*/

import * as THREE from 'three'

import { PatternManager } from './PatternManager';
import { OctreeManager } from './OctreeManager'
import Pigeon from '../Environment/Pigeon'
import Target from '../Environment/Target'
import { MathUtils } from 'three';
import { AgentParams } from '../Environment/Agent';

const NUM_PIGEONS = 800; 

export let TargetParams = {
    ShowTarget: true
}

class PigeonManager {
    constructor() {
        // Manages the octree for the pigeons. 
        this.octreeManager = new OctreeManager();

        // Manages the current pattern for the flock. 
        this.patternManager = new PatternManager(); 
        
        // Container of all the pigeons. 
        this.pigeons = [];
        
        // Clock, required for animation of the agents. 
        this.clock = new THREE.Clock(); 
    }

    setup(scene, currentPatternType) {
        console.log('Pigeon Manager Pattern: ' + currentPatternType);
        
        this.spawnPigeons(scene);

        // Create the target object that the pigeons are following. 
        this.target = new Target(scene);

        // Create the target pattern.
        this.patternManager.setTargetPattern(currentPatternType); 
    }

    update() {
        // Do any pigeons exist? 
        if (this.pigeons.length > 0) {
            // Don't do anything until we have a valid target position. 
            let patternPos = this.patternManager.update(); 
            if (patternPos) {
                this.target.setVector(patternPos);
                this.target.setVisibility(TargetParams.ShowTarget);

                // Update octree. 
                // Note: On every update, we instantiate a new octree
                // and populate it with the new pigeon position. So everytime, 
                // the neighbors get updated. 
                this.octreeManager.update(patternPos, this.pigeons); 

                let nAgents = []; // Neighboring agents. 

                // Delta change in time to advance the animation of the wings. 
                let delta = this.clock.getDelta(); 
                this.pigeons.forEach(p => {
                    // Update the target's position 
                    p.setTarget(patternPos); 
                    // Find and update the location of neighboring agents
                    nAgents = this.octreeManager.getNeighbours(p.position); 
                    p.update(delta, nAgents);
                });
            }
            
            // Slowly reset some of the agent params that was disturbed by the gun shot
            this.recoverFromShock()
        }
    }

    setNewPatternType(newPatternType) {
        this.patternManager.setTargetPattern(newPatternType)
    }

    spawnPigeons(scene) {
        // NOT IMPLEMENTED
        // ISSUES IN CLEANING GEOMETRY!!
        /// Empty the pigeons first. 
        // if (this.pigeons.length > 0) {
        //     scene.children.forEach(child => {
        //         if (child.name === 'pigeon') {
        //             child.remove(child[0]);
        //         }
        //     });
        // }

        // Instantiate pigeons again. 
        for (let i = 0; i < NUM_PIGEONS; i++) {
            let p = new Pigeon(scene); 
            this.pigeons.push(p);
        }
    }

    shootPigeon() {
        // Set one randome pigeon to be dead
        let choseOne = MathUtils.randInt(0, this.pigeons.length - 1)
        this.pigeons[choseOne].isAlive = false;
        
        // Gun shot will scare them away
        AgentParams.SeperationForce *= 3
        AgentParams.AttractionForce *= 0.1
    }

    recoverFromShock() {
        // Separation would decay overtime to recover from gun shot
        AgentParams.SeperationForce *= 0.999;
        AgentParams.SeperationForce = MathUtils.clamp(AgentParams.SeperationForce, 1.2, 2);      
        
        // Agent would focus back on seeking target again
        AgentParams.AttractionForce *= 1.001;
        AgentParams.AttractionForce = MathUtils.clamp(AgentParams.AttractionForce, 0.5, 2);
    }
} 

export default PigeonManager;