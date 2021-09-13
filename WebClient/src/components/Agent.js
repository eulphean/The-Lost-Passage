import * as THREE from 'three'
import * as Utility from './Utility'
import {EllipsePattern, ellipseConstructor} from './PatternManager'

const FLOCKING_WEIGHTS = {
    SEPERATION: 5.0,
    COHESION: 1.5,
    ALIGNMENT: 1.5
}

export default class Agent {
    constructor() {
        // this.idx = i; 
        // // Construct all important variables. 
        this.position = new THREE.Vector3(0, 2, 0); 
        this.velocity = new THREE.Vector3(0.1, 0.1, 0.1); 
        this.acceleration = new THREE.Vector3(0, 0, 0); 
        this.rotationA = new THREE.Quaternion(); 
        this.rotationB = new THREE.Quaternion(); 
        this.fSteer = new THREE.Vector3(0, 0, 0);
        this.vDesired = new THREE.Vector3(0, 0, 0); 
        
        // Helper vectors. 
        this.sumVec = new THREE.Vector3(0, 0, 0);
        this.diffVec = new THREE.Vector3(0, 0, 0); 

        // Force and speeds. 
        this.maxForce = 0.01; 
        this.maxSpeed = 0.025; 
        this.maxSlowDownSpeed = 0; 

        // Tolerances
        this.slowDownTolerance = 0.2 * 0.2; 
        this.arriveTolerance = 0.01 * 0.01; 
        this.smoothFactor = 0.001; // Velocity smoothing.

        // Target value that changes based on the pattern position. 
        this.target = new THREE.Vector3(0, 0, 0); 

        // NOTE: This target position should be injected into the agent. 
        // It should not be responsible to construct it. 
        // WORLD should be holding a pointer to the pattern maker. 
        // The way this agent will move around the world. 
        this.setupPattern(); 
    }

    updateAgent() {
        this.seekTarget(); 
        this.updatePosition();
        this.updatePattern(); 
    }

    seekTarget() {
        this.seek(); // Calculate the force required to seek the target position. 
        this.applyForce(); // Apply the force. 
    }

    updatePosition() {
        // // What's my target velocity? 
        //this.sumVec.addVectors(this.velocity, this.acceleration); 
        
        // What's my intermediate velocity? 
        // Lerp the velocity rather than just updating straight up.
        //this.velocity = this.velocity.lerp(this.sumVec, this.smoothFactor); 
        //this.velocity.clampLength(-9999, this.maxSpeed); 

        //this.position.add(this.velocity); 

        // Reset acceleration. 
        //this.acceleration.multiplyScalar(0);

        // Update parameters. 
        this.velocity.add(this.acceleration);
        this.velocity.clampLength(-9999, this.maxSpeed); 
        this.position.add(this.velocity); 
        this.acceleration.multiplyScalar(0); 
    }

    applyForce() {
        // Add steering force to acceleration to change the position of the agent. 
        this.acceleration.add(this.fSteer); 
    }

    seek() {
        // Calculate desired velocity. 
        this.vDesired.subVectors(this.target, this.position); 
        this.vDesired.normalize();
        this.vDesired.multiplyScalar(this.maxSpeed); 

        // Calculate steering force.
        this.fSteer.subVectors(this.vDesired, this.velocity); 
        this.fSteer.clampLength(-99999, this.maxForce); 

        console.log('Steering Force: ' + this.fSteer);
       
        //let d = this.fSteer.lengthSq();


        // if (d < this.slowDownTolerance && d > this.arriveTolerance) {
        //     // Start slowing down. 
        //     let newMaxSpeed = Utility.map_range(d, this.slowDownTolerance, this.arriveTolerance, this.maxSpeed, this.maxSlowDownSpeed); 
        //     this.fSteer.multiplyScalar(newMaxSpeed); 
        // } else {
        //     // We are still trying to get to the target. 
        //     this.fSteer.multiplyScalar(this.maxSpeed); 
        // }


        // Why??
        // this.fSteer.sub(this.velocity); 

        //this.fSteer = MathUtility.clamp(this.fSteer, this.maxForce); 
        // this.fSteer.clampLength(-99999, this.maxForce); 
    }

    setupPattern() {
        let pos = new THREE.Vector3(0, 2, 0); // Target position
        let radX = 5; 
        let radZ = 5;
        let amp = 1; 
        let dir = true; 
        let moveFactor = THREE.Math.degToRad(0.3); 
        let patternObj = ellipseConstructor(pos, radX, radZ, amp, dir, moveFactor); 
        this.ellipsePattern = new EllipsePattern(patternObj); 
    }

    updatePattern() {
        this.ellipsePattern.update(); 
        let patternPos = this.ellipsePattern.getTargetPos();
        this.target.copy(patternPos);
    }
}