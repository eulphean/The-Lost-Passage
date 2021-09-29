import * as THREE from 'three'
import * as Utility from '../Utilities/Utility'

export let AgentParams = {
    SmoothFactor: 0.01,
    AttractionForce : 1.5,
    SeperationForce: 1.2,
    CohesionForce: 1.1,
    AlignmentForce: 1.4,
    Gravity: new THREE.Vector3(0, -0.3, 0)
}

export default class Agent {
    constructor() {
        // this.idx = i; 
        // // Construct all important variables. 
        this.position = new THREE.Vector3(Math.random() * 20, Math.random() * 20, Math.random() * 20); 
        this.velocity = new THREE.Vector3(0.0, 0.0, 0.0); 
        this.acceleration = new THREE.Vector3(0, 0, 0); 
        this.rotationA = new THREE.Quaternion(); 
        this.rotationB = new THREE.Quaternion(); 
        this.fSteer = new THREE.Vector3(0, 0, 0);
        this.vDesired = new THREE.Vector3(0, 0, 0); 
        
        // Helper vectors. 
        this.sumVec = new THREE.Vector3(0, 0, 0);
        this.diffVec = new THREE.Vector3(0, 0, 0); 

        // Force and speeds. 
        this.maxSpeed = Utility.getRandomNum(0.03, 0.5); 

        // Target value that changes based on the pattern position. 
        this.target = new THREE.Vector3(0, 0, 0); 

        // Agent will be animated if it's alive
        this.isAlive = true;
    }

    updateBehaviour(nAgents) {
        // Seek target
        this.seek();

        // Flock with other nearby pigeons
        nAgents.forEach( neighbor => {
            // calculate a directional vec from my neighbor to me
            this.diffVec.subVectors(this.position, neighbor.position)

            // Pass it down for force calculation
            this.seperate(this.diffVec); 

            this.cohere(this.diffVec);

            this.align(neighbor, this.diffVec);
        })
    }

    updatePosition() {
        // Target velocity. 
        this.sumVec.addVectors(this.velocity, this.acceleration); 
        
        // What's my intermediate velocity? 
        // Lerp the velocity rather than just updating straight up.
        this.velocity = this.velocity.lerp(this.sumVec, AgentParams.SmoothFactor); 
        this.velocity.clampLength(-9999, this.maxSpeed); 

        this.position.add(this.velocity); 
        this.acceleration.multiplyScalar(0); 
    }

    applyForce() {
        // Add steering force to acceleration to change the position of the agent. 
        this.acceleration.add(this.fSteer); 
    }

    seek() {
        // Calculate a desired direction, and multiply it by force. 
        this.vDesired.subVectors(this.target, this.position); 
        this.vDesired.normalize();
        this.vDesired.multiplyScalar(AgentParams.AttractionForce);

        // Add steering force.
        this.fSteer.add(this.vDesired); 
    }

    seperate(diffVec) {
        this.vDesired.copy(diffVec)
        this.vDesired.normalize(); 
        this.vDesired.multiplyScalar(AgentParams.SeperationForce);
        this.fSteer.add(this.vDesired)
    }

    cohere(diffVec) {
        this.vDesired.copy(diffVec);
        this.vDesired.multiplyScalar(-1); // Reverse the vector direction to get closer
        this.vDesired.normalize();
        this.vDesired.multiplyScalar(AgentParams.CohesionForce);
        this.fSteer.add(this.vDesired); 
    }

    align(neighbor, diffVec) {
        this.vDesired.copy(neighbor.velocity);
        this.vDesired.divideScalar(diffVec.lengthSq()); // Weighted alignment by distance
        this.vDesired.multiplyScalar(AgentParams.AlignmentForce); // Apply alignment weight. 
        this.fSteer.add(this.vDesired); 
    }

    setTarget(targetPos) {
        this.target.copy(targetPos);
    }
}