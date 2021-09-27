    /*
  Name: PigeonManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Container class that manages all the pigeons that are created in the world. 
*/

import * as THREE from 'three'

import { EllipsePattern, ellipseConstructor } from './PatternManager';
import { OctreeManager } from './OctreeManager'
import Pigeon from '../Environment/Pigeon'
import Target from '../Environment/Target'

const NUM_PIGEONS = 50; 

export let TargetParams = {
    ShowTarget: true
}

class PigeonManager {
    constructor(scene) {
        // Manages the octree for the pigeons. 
        this.octreeManager = new OctreeManager();
        
        // Container of all the pigeons. 
        this.pigeons = [];
        
        // Clock, required for animation of the agents. 
        this.clock = new THREE.Clock(); 

        this.setupTargetPattern(); 
    }

    setup(scene) {
        // Instantiate all the pigeons. 
        for (let i = 0; i < NUM_PIGEONS; i++) {
            let p = new Pigeon(scene); 
            this.pigeons.push(p);
        }

        // Create the target object that the pigeons are following. 
        this.target = new Target(scene);
    }

    setupTargetPattern() {
        let pos = new THREE.Vector3(0, 6, 0); // Target position
        let radX = 10; 
        let radZ = 10;
        let amp = 0; 
        let dir = true; 
        let moveFactor = THREE.Math.degToRad(0.3); 
        let patternObj = ellipseConstructor(pos, radX, radZ, amp, dir, moveFactor); 
        this.ellipsePattern = new EllipsePattern(patternObj); 
    }

    update() {
        // Do any pigeons exist? 
        if (this.pigeons.length > 0) {
            // Target pattern's current position. 
            this.ellipsePattern.update();
            let patternPos = this.ellipsePattern.getTargetPos();

            // Update octree. Note: On every update, we instantiate a new octree
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

            // Target object properties. 
            this.target.setVector(patternPos);
            this.target.setVisibility(TargetParams.ShowTarget);
        }

        // Else don't do anything. 
    }
} 

export default PigeonManager;