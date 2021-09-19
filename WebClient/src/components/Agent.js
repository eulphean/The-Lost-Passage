import * as THREE from 'three'
import * as Utility from './Utility'

const FLOCKING_WEIGHTS = {
    SEPERATION: 1.2,
    COHESION: 0.5,
    ALIGNMENT: 0.2
}

export default class Agent {
    constructor() {
        // this.idx = i; 
        // // Construct all important variables. 
        this.position = new THREE.Vector3(Math.random() * 20, 2, 0); 
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
        this.maxSpeed = this.getRandomArbitrary(0.015, 0.025); 
        this.maxSlowDownSpeed = 0; 

        // Tolerances
        this.slowDownTolerance = 0.2 * 0.2; 
        this.arriveTolerance = 0.01 * 0.01; 
        this.smoothFactor = 0.01; // Velocity smoothing.

        // Target value that changes based on the pattern position. 
        this.target = new THREE.Vector3(0, 0, 0); 
    }

    updateAgent(nAgents) {
        this.seekTarget(); 
        this.flock(nAgents); 
        this.updatePosition();
    }

    seekTarget() {
        this.seek(); // Calculate the force required to seek the target position. 
        this.applyForce(); // Apply the force. 
    }

    flock(nAgents) {
        if (nAgents.length > 0) {
            this.seperation(nAgents); 
            this.applyForce(); 

            this.cohesion(nAgents);
            this.applyForce();

            this.align(nAgents);
            this.applyForce();
        }
    }

    updatePosition() {
        // Target velocity. 
        this.sumVec.addVectors(this.velocity, this.acceleration); 
        
        // What's my intermediate velocity? 
        // Lerp the velocity rather than just updating straight up.
        this.velocity = this.velocity.lerp(this.sumVec, this.smoothFactor); 
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

        let d = this.vDesired.lengthSq(); 
        if (d < this.slowDownTolerance && d > this.arriveTolerance) {
            let newMaxSpeed = Utility.map_range(d, this.slowDownTolerance, this.arriveTolerance, this.maxSpeed, this.maxSlowDownSpeed); 
            this.vDesired.multiplyScalar(newMaxSpeed); 
        } else {
            this.vDesired.multiplyScalar(this.maxSpeed); 
        }

        // Calculate steering force.
        this.fSteer.subVectors(this.vDesired, this.velocity); 
        this.fSteer.clampLength(-99999, this.maxForce); 
    }

    seperation(nAgents) {
        this.fSteer.set(0, 0, 0); 
        this.sumVec.set(0, 0, 0); 

        if (nAgents.length > 0) {
            nAgents.forEach(n => {
                this.diffVec.subVectors(this.position, n.position); 
                this.diffVec.normalize(); 
                this.diffVec.divideScalar(this.diffVec.length());  // Weight the vector properly based on the distance from the target. 
                this.sumVec.add(this.diffVec); 
            });
            
            // Calculate desired force using the average desired velocity 
            this.sumVec.divideScalar(nAgents.length); 
            if (this.sumVec.lengthSq() > 0) {
                this.sumVec.normalize(); 
                this.sumVec.clampLength(-99999, this.maxSpeed);
                this.fSteer.subVectors(this.sumVec, this.velocity);
                this.fSteer.clampLength(-99999, this.maxForce); 
                this.fSteer.multiplyScalar(FLOCKING_WEIGHTS.SEPERATION); // Apply seperation weight. 
            }
        }
    }

    cohesion(nAgents) {
        this.target.set(0, 0, 0); 
        this.fSteer.set(0, 0, 0); 

        if (nAgents.length > 0) {
            nAgents.forEach(n => {
                this.target.add(n.position); 
            }); 

            this.target.divideScalar(nAgents.length); 
            this.seek(); // Seek the new target
            this.fSteer.multiplyScalar(FLOCKING_WEIGHTS.COHESION); 
        }
    }

    align(nAgents) {
        this.fSteer.set(0, 0, 0); 

        if (nAgents.length > 0) {
            nAgents.forEach(a => {
                this.fSteer.add(a.velocity); 
            }); 
        
            this.fSteer.divideScalar(nAgents.length); 
            this.fSteer.normalize(); 
            this.fSteer.multiplyScalar(this.maxSpeed); 
            this.fSteer.sub(this.velocity); 
            this.fSteer.clampLength(-99999, this.maxForce); 
            this.fSteer.multiplyScalar(FLOCKING_WEIGHTS.ALIGNMENT); // Apply alignment weight. 
        }
    }

    setTarget(targetPos) {
        this.target.copy(targetPos);
    }
    
    getRandomArbitrary(min, max) {
       return Math.random() * (max - min) + min;
    }
}