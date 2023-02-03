/*
  Name: PatternManager.js
  Author: Amay Kataria
  Date: 09/21/2021
  Description: A class that holds two different patterns for birds. These are configured using 
  two param objects that are exposed in the GUI. 
*/

import * as THREE from 'three'

// Pattern exports for the GUI
export let PatternParams = {
    PatternType: '' // Build the list in ServerGui. Ellipse / Rose-Curve
}; 
export let PatternTypes = {
    Ellipse: 0,
    RoseCurve: 1
}

// Ellipse Params
export let EllipseParams = {
    Origin: {x: 0, y: 6, z: 0},
    Radii: {x: 10, y: 10},
    Amplitude: 0,
    Speed: 0.3, 
    Direction: true
}  

// Rose-Curve Params
export let RoseCurveParams = {
    Origin: {x: 0, y: 6, z: 0},
    Radius: 175,
    Phase: 0., 
    NumPetals: 5, 
    Amplitude: 300,
    Sinusoidal: true,
    Direction: true,
    Speed: 0.35
}

class Pattern {
    constructor(patternObj) {
        this.theta_rad = 0; 
        this.amp = patternObj.amp;  
        this.isClockwise = patternObj.dir; 
        this.originPos = patternObj.pos; 
        this.moveFactor = patternObj.move; 
        this.targetPos = new THREE.Vector3(0, 0, 0); // Agents follow this target. 
        this.targetConst = new THREE.Vector3(0, 0, 0);
    }

    updateTheta(maxTheta) {
        // Update theta based on direction. 
        this.theta_rad = this.isClockwise ? 
            this.theta_rad + this.moveFactor : 
            this.theta_rad - this.moveFactor; 

        // Reset theta. 
        this.theta_rad = this.theta_rad >= maxTheta ? 0 : this.theta_rad;
    }

    cartesianX(r) {
        return this.originPos.x + r * Math.cos(this.theta_rad);
    }

    cartesianZ(r) {
        return this.originPos.z + r * Math.sin(this.theta_rad);
    }
    
    cartesianY(r) {
        return this.originPos.y + this.amp * Math.sin(this.theta_rad);
    }

    getTargetPos() {
        //return this.targetPos; 
        return this.targetPos;
    }
}

export const ellipseConstructor = (originPos, radX, radZ, amplitude, isClockwise, moveFactor) => {
    return {
        pos: originPos, // C
        radx: radX,
        radz: radZ,
        amp: amplitude, // C
        dir: isClockwise, // C
        move: moveFactor // C
    }; 
}

export class EllipsePattern extends Pattern {
    constructor(patternObj) {
        super(patternObj); 
        this.radX = patternObj.radx; 
        this.radZ = patternObj.radz; 
        this.maxTheta = 2*Math.PI; 
    }

    update() {
        this.updateGuiParams(); 
        // Ellipse: Cartesian coordinates. 
        let xPos = this.cartesianX(this.radX); // Defines polar curve. 
        let zPos = this.cartesianZ(this.radZ); // Define polar curve. 
        let yPos = this.cartesianY(); // Defines height. 
        this.targetPos.set(xPos, yPos, zPos); 

        this.updateTheta(this.maxTheta); 
    }

    updateGuiParams() {
        this.originPos.set(EllipseParams.Origin.x, EllipseParams.Origin.y, EllipseParams.Origin.z);
        this.radX = EllipseParams.Radii.x;
        this.radZ = EllipseParams.Radii.y;
        this.amp = EllipseParams.Amplitude; 
        this.moveFactor = THREE.MathUtils.degToRad(EllipseParams.Speed); 
        this.isClockwise = EllipseParams.Direction; 
    }   
}

export const roseConstructor = (originPos, radius, phase, numPetals, amplitude, isSinusoidal, isClockwise, moveFactor) => {
    return {
        pos: originPos, // C
        rad: radius,
        ph: phase, 
        numP: numPetals,
        amp: amplitude, // C
        isSin: isSinusoidal,
        dir: isClockwise, // C
        move: moveFactor // C
    }
}

// r = asin(b + cTheta); 
// r = acos(b + cTheta); 
// a = radius
// b = phase
// c = numPetals
export class RosePattern extends Pattern {
    constructor(patternObj) {
        super(patternObj); 
        this.rad = patternObj.rad; 
        this.phase = patternObj.ph; 
        this.numPetals = patternObj.numP;
        this.isSin = patternObj.isSin; 
        this.maxTheta = Math.PI; 
    }

    update() {
        this.updateGuiParams(); 

        let xPos, yPos, zPos; 
        let r = this.isSin ? this.rad * Math.sin(this.phase + this.numPetals * this.theta_rad) : 
            this.rad * Math.cos(this.phase + this.numPetals * this.theta_rad)

        xPos = this.cartesianX(r); // Defines polar curve. 
        zPos = this.cartesianZ(r); // Defines polar curve. 
        yPos = this.cartesianY(); // Defines height. 

        this.targetPos.set(xPos, yPos, zPos); 

        this.updateTheta(this.maxTheta);
    }

    updateGuiParams() {
        this.originPos.set(RoseCurveParams.Origin.x, RoseCurveParams.Origin.y, RoseCurveParams.Origin.z); 
        this.rad = RoseCurveParams.Radius; 
        this.phase = RoseCurveParams.Phase;
        this.amp = RoseCurveParams.Amplitude; 
        this.numPetals = RoseCurveParams.NumPetals;
        this.isSin = RoseCurveParams.Sinusoidal; 
        this.isClockwise = RoseCurveParams.Direction; 
        this.moveFactor = THREE.MathUtils.degToRad(RoseCurveParams.Speed); 
    }
}

export class PatternManager {
    setTargetPattern(curPatternType) {
        if (curPatternType === PatternTypes.Ellipse) {
            console.log('Creating Ellipse Pattern');
            let pos = new THREE.Vector3(0, 6, 0); // Target position
            let radX = 10; 
            let radZ = 10;
            let amp = 0; 
            let dir = true; 
            let moveFactor = THREE.MathUtils.degToRad(0.3); 
            let patternObj = ellipseConstructor(pos, radX, radZ, amp, dir, moveFactor); 
            this.curPattern = new EllipsePattern(patternObj); 
        } else if (curPatternType === PatternTypes.RoseCurve) {
            // Initialize Rose-Curve pattern. 
            console.log('Creating Rose-Curve Pattern');
            let pos = new THREE.Vector3(0, 6, 0); 
            let rad = 10; 
            let phase = 0.5; 
            let numPetals = 3; 
            let amp = 0;
            let isSin = true; 
            let dir = true; 
            let moveFactor = THREE.MathUtils.degToRad(0.3); 
            let patternObj = roseConstructor(pos, rad, phase, numPetals, amp, isSin, dir, moveFactor);
            this.curPattern = new RosePattern(patternObj);
        }
    }

    update() {
        if (this.curPattern) {
            this.curPattern.update(); 
            return this.curPattern.getTargetPos();
        }        
    }
}