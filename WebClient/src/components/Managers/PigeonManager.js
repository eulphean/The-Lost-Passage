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

const NUM_PIGEONS = 50; 

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
        // Instantiate all the pigeons. 
        for (let i = 0; i < NUM_PIGEONS; i++) {
            let p = new Pigeon(scene); 
            this.pigeons.push(p);
        }

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
        }

        // Else don't do anything. 
    }

    setNewPatternType(newPatternType) {
        this.patternManager.setTargetPattern(newPatternType)
    }
} 

export default PigeonManager;