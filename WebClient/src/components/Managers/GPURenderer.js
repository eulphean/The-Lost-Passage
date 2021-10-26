/*
  Author: Amay Kataria
  Date: 10/21/2021
  Title: GPURenderer.js
  Description: This handles all the logic related to GPUComputationRenderer that we 
  use to calculate velocity and position updates of the pigeon. 
*/


import * as THREE from 'three'
import { WIDTH } from '../Environment/GPUPigeon.js'
import { PigeonParams } from './PigeonManager.js';
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import fragmentShaderPosition from '../../shaders/fragmentShaderPosition.glsl'
import fragmentShaderVelocity from '../../shaders/fragmentShaderVelocity.glsl'
import { TargetParams } from '../Environment/Target.js';

// const BOUNDS = 100;
// const BOUNDS_HALF = BOUNDS / 2; 

export let IsGPURendererReady = false; 

class GPURenderer {
    constructor(renderer) {
        this.gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer); 
        
        // Textures for position and velocity computations. 
        // Each texture is WIDTH x WIDTH wide. Each texel holds 
        // 4 floats (RGBA) for computation. Array is divided in chunks of 4. 
        // This texture is of type THREE.DataTexture, which actually stores
        // the data of a Three.js Texture. 
        const dtPosition = this.gpuCompute.createTexture();
        const dtVelocity = this.gpuCompute.createTexture(); 
        this.fillPositionTexture(dtPosition);
        this.fillVelocityTexture(dtVelocity); 

        // Variables are the ones that are actually undergoing computation in the GPURenderer. 
        // (VariableName, Shader, DataTexture)
        // Each variable contains 'material' property, which is of type THREE.ShaderMaterial
        this.velocityVariable = this.gpuCompute.addVariable("textureVelocity", fragmentShaderVelocity, dtVelocity);
        this.positionVariable = this.gpuCompute.addVariable("texturePosition", fragmentShaderPosition, dtPosition);

        // Set the dependencies between variables and their data textures will be available between each other. 
        // For example in fragmentShaderVelocity, the dataTexture for position is available. 
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

        // Retrieve uniforms from ShaderMaterial, so it can be populated with custom uniforms. 
        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms = this.velocityVariable.material.uniforms;

        // Position uniforms. 
        // TIME
        this.positionUniforms["uTime"] = { value: 0.0 };
        this.positionUniforms["uDelta"] = { value: 0.0 };
        this.positionUniforms["uReset"] = { value: false };

        // Velocity uniforms. 
        // TIME 
        this.velocityUniforms["uTime"] = { value: 1.0 };
        this.velocityUniforms["uDelta"] = { value: 0.0 };

        // FLOCK 
        this.velocityUniforms["uAttractionForce"] = { value: PigeonParams.Attraction }
        this.velocityUniforms["uSeperationForce"] = { value: PigeonParams.Seperation };
        this.velocityUniforms["uAlignmentForce"] = { value: PigeonParams.Alignment };
        this.velocityUniforms["uCohesionForce"] = { value: PigeonParams.Cohesion };

        // TARGET
        this.velocityUniforms["uTargetPosition"] = { value: new THREE.Vector3() };
        this.velocityUniforms['uTargetRadius'] = { value: TargetParams.CurrentTargetRadius };

        // SPEED
        this.velocityUniforms["uMaxAgentSpeed"] = { value: PigeonParams.MaxSpeed };
        this.velocityUniforms["uSpeedLerp"] = { value: PigeonParams.SpeedLerp };

        // BOUNDING BOX
        this.velocityUniforms["uBoundingBoxMin"] = { value: new THREE.Vector3() };
        this.velocityUniforms["uBoundingBoxMax"] = { value: new THREE.Vector3() };
        
        // Velocity variable.
        this.velocityVariable.wrapS = THREE.RepeatWrapping;
        this.velocityVariable.wrapT = THREE.RepeatWrapping;

        // Position variable. 
        this.positionVariable.wrapS = THREE.RepeatWrapping;
        this.positionVariable.wrapT = THREE.RepeatWrapping;

        // A simple test to make sure GPURenderer has everything. 
        const error = this.gpuCompute.init();

        if ( error !== null ) {
            console.error( error );
        }
        
        // GPU Renderer is ready. 
        IsGPURendererReady = true;
        console.log('GPU Renderer Ready.') 
    } 

    update(delta, now, targetPosition, boundingBox) {
        // GPGPU shader uniform values that are changing on every frame.

        // RESET
        this.positionUniforms["uReset"].value = this.reset;

        // TIME
        this.positionUniforms["uDelta"].value = delta; 
        this.positionUniforms["uTime"].value = now;
        this.velocityUniforms["uDelta"].value = delta;
        this.velocityUniforms["uTime"].value = now;

        // FLOCK 
        this.velocityUniforms["uAttractionForce"].value = PigeonParams.Attraction;
        this.velocityUniforms['uSeperationForce'].value = PigeonParams.Seperation; 
        this.velocityUniforms['uAlignmentForce'].value = PigeonParams.Alignment;
        this.velocityUniforms['uCohesionForce'].value = PigeonParams.Cohesion;

        // TARGET
        this.velocityUniforms['uTargetPosition'].value.set(targetPosition.x, targetPosition.y, targetPosition.z);
        this.velocityUniforms['uTargetRadius'].value = TargetParams.CurrentTargetRadius;

        // SPEED
        this.velocityUniforms['uMaxAgentSpeed'].value = PigeonParams.MaxSpeed; 
        this.velocityUniforms["uSpeedLerp"].value = PigeonParams.SpeedLerp;

        // BOUNDING BOX
        this.velocityUniforms["uBoundingBoxMin"].value.set(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z);
        this.velocityUniforms["uBoundingBoxMax"].value.set(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z); 

        // Compute velocity and position shaders and 
        // populate the vel and pos textures with new values.
        this.gpuCompute.compute();

        // Make sure it's not resetting again 
        // until actually reset. 
        if (this.reset) {
            this.reset = false;
        }
    }

    // Starting positions. 
    fillPositionTexture(texture) {
        // Size of this array is actually WIDTH x WIDTH * 4;
        const theArray = texture.image.data;
        // Each texel is 4 floats. 
        for (let k = 0, kl = theArray.length; k < kl; k += 4) {
            // Can remove BOUNDS they are all emanate from the center. 
            // const x = Math.random() * BOUNDS;
            // const y = Math.random() * BOUNDS;
            // const z = Math.random() * BOUNDS;
            const x = Math.random() - 0.5;
            const y = Math.random() - 0.5;
            const z = Math.random() - 0.5;

            // 4th. 
            theArray[k + 0] = x;
            theArray[k + 1] = y;
            theArray[k + 2] = z;
            theArray[k + 3] = 1;
        }
    }

    // Starting velocities. 
    fillVelocityTexture(texture) {
        const theArray = texture.image.data;
        for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {
            const x = Math.random() - 0.5;
            const y = Math.random() - 0.5;
            const z = Math.random() - 0.5;

            theArray[k + 0] = x * 5.0;
            theArray[k + 1] = y * 5.0;
            theArray[k + 2] = z * 5.0;
            theArray[k + 3] = 1;
        }
    }

    getPositionRenderTarget() {
        return this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture; 
    }

    getVelocityRenderTarget() {
        return this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
    }

    resetPigeons() {
        this.reset = true; 
    }
}

export default GPURenderer;