/*
  Name: PigeonManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Container class that manages all the pigeons that are created in the world. 
*/

import * as THREE from 'three'

// import GPUPigeon from '../Environment/GPUPigeon.js'
import { PatternManager } from './PatternManager';
import AudioManager from './AudioManager';
import Target from '../Environment/Target'
import GPUPigeon from '../Environment/GPUPigeon.js';
import { BIRDS } from '../Environment/GPUPigeon.js'
import GPURenderer from './GPURenderer.js';
import { MicParams } from './AudioManager';

// Set this to true when everything has been loaded. 
export let IsPigeonManagerReady = false; 

// PARAMS shared between GPURenderer 
// and PigeonManager. 
export let PigeonParams = {
    Attraction: 0.1,
    Seperation: 0.4,
    Alignment: 0.5,
    Cohesion: 0.1,
    Freedom: 1.5,
    MaxSpeed: 0.1,
    SpeedLerp: 0.1,
    Size: 0.11,
    Count: BIRDS
}

const KillFactor = 250; 

class PigeonManager {
    constructor(scene) {
        // Manages the moving target for the flock. 
        this.patternManager = new PatternManager(); 

        // Create the target object that the pigeons are following. 
        this.target = new Target(scene);
        this.targetPosition = new THREE.Vector3(0, 0, 0);

        // State varables for shooting related behaviours
        this.isFlockInShock = false;
        this.previousSepValue = 0.0;
        this.previousSpeedValue = 0.0;

        // Clock, required for animation of the agents. 
        this.clock = new THREE.Clock(); 

        // Shader to set the uniforms on.
        this.pigeonShader = ''; 

        // GPURenderer
        this.gpuRenderer = '';

        // // Keep track of how many times user interacted.
        // this.shootCount = 0; 
    }
    
    setupTarget(curPatternType) {
        // Create the target pattern.
        this.patternManager.setTargetPattern(curPatternType); 
    }   

    // Do this when we are doing the loading routine. 
    setupPigeonGPU(renderer, scene) {
        // Initialize pigeon and set renderer etc. 
        this.pigeon = new GPUPigeon(this.initPigeons.bind(this, renderer, scene)); 
    }

    update(boundingBox, cameraPos, cameraUp) {
        if (IsPigeonManagerReady) {
            this.targetPosition = this.patternManager.update();
            if (AudioManager.foundFace()) {
                let mappedX = AudioManager.getTargetPos(boundingBox);
                this.targetPosition.crossVectors(cameraPos, cameraUp);
                this.targetPosition.normalize();
                this.targetPosition.multiplyScalar(-mappedX);
            }

            // If we have a valid target position, begin updating.
            if (this.targetPosition) {
                let delta = this.clock.getDelta();
                let now = this.clock.oldTime;

                // Move target object to that position.
                this.target.update(this.targetPosition, now);

                // Computer GPU values. 
                this.gpuRenderer.update(delta, now, this.targetPosition, boundingBox); 
                // Bird material's uniform value that is changing every frame. 
                if (this.pigeonShader) {
                    this.pigeonShader.uniforms["time"].value = now / 1000;
                    this.pigeonShader.uniforms["delta"].value = delta;

                    // Bing pigeon size.
                    this.pigeonShader.uniforms['size'].value = PigeonParams.Size * 10; 

                    // Extract the data textures for Position and Velocity from GPURenderer and set it to the uniforms
                    // of the bird's material to set the new location of the vertices in the BufferGeometry. 
                    this.pigeonShader.uniforms["texturePosition"].value = this.gpuRenderer.getPositionRenderTarget();
                    this.pigeonShader.uniforms["textureVelocity"].value = this.gpuRenderer.getVelocityRenderTarget();
                }

                // Bind pigeon count.
                this.pigeon.setDrawRange(PigeonParams.Count); 
            }

            // // Map mic params to seperation. 
            // let v = this.mapRange(MicParams.HighMid, 0, 0.8, 20, 100);
            // PigeonParams.Seperation = v; 

            // v = this.mapRange(MicParams.Treble, 0, 0.8, 15, 60); 
            // PigeonParams.MaxSpeed = v; 

            // v = this.mapRange(MicParams.Bass, 0, 0.8, 12, 3); 
            // PigeonParams.Alignment = v; 

            // The flock will only recover from shock if they were indeed in shock
            if (this.isFlockInShock){
                this.recoverFromShock() ;
            }
        }
    }

    mapRange (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    pausePigeons() {
        if (this.gpuRenderer) {
            this.gpuRenderer.pausePigeons();
        }
    }

    initPigeons(renderer, scene) {
        const geometry = this.pigeon.birdGeometry;

        // simple standard material, which we will override to animate all the geometry
        // that has been assigned into Bird Geometry. 
        const geoMaterial = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: true,
            side: THREE.DoubleSide,
            roughness: 0,
            metalness: 0
        });

        // Shader hook - to add some content before we actually compile
        // the MeshStandardMaterial. We get access to the actual MeshStandard
        // shader in this hook. 
        geoMaterial.onBeforeCompile = (shader) => {
            // Add uniforms to the shader that will be used. 
            // Some uniforms are changing in every frame like texturePosition
            // and textureVelocity, so we update that in animate().
            shader.uniforms.texturePosition = { value: null };
            shader.uniforms.textureVelocity = { value: null }; 
            // TextureAnimation is DataTexture for the animation that we prepared when loading our geometry. 
            shader.uniforms.textureAnimation = { value: this.pigeon.textureAnimation }; // Never have to update again.
            shader.uniforms.time = { value: 1.0 };

            shader.uniforms.size = { value: 0.2 };
            shader.uniforms.delta = { value: 0.0 }; 

            // Replace token with token + insert. 
            let token = '#define STANDARD';
            let insert = /* glsl that we will insert after STANDARD */
            `
                attribute vec4 reference;
                attribute vec4 seeds;
                uniform sampler2D texturePosition;
                uniform sampler2D textureVelocity;
                uniform sampler2D textureAnimation;
                uniform float size;
                uniform float time;
            `;

            // Add GLSL in MaterialShader. 
            shader.vertexShader = shader.vertexShader.replace( token, token + insert );

            // Replace token with token + insert.
            // NOTE: This shader is basically using positionData, velocityData, and animationData to update the position
            // of each vertex in the Buffer Geometry. All the computation that happens on the GPU gets fed into this 
            // calculation to update the position of each vertex in the BufferGeometry based on the position, velocity, and animation 
            // frame that a bird is on. We don't need to touch this shader at all - This is rock solid. As we update the position and 
            // velocity shaders, this should just do the right thing. 
            token = '#include <begin_vertex>';
            insert = /* glsl */
            `
                vec4 tmpPos = texture2D(texturePosition, reference.xy);

                vec3 pos = tmpPos.xyz;
                vec3 velocity = normalize(texture2D(textureVelocity, reference.xy).xyz);
                vec3 aniPos = texture2D(textureAnimation, vec2(reference.z, mod(time + (seeds.x) * ((0.0004 + seeds.y / 10000.0) + normalize(velocity) / 20000.0), reference.w))).xyz;
                vec3 newPosition = position;

                newPosition = mat3(modelMatrix) * (newPosition + aniPos);
                newPosition *= size + seeds.y * size * 0.2;

                velocity.z *= -1.;
                float xz = length(velocity.xz);
                float xyz = 1.;
                float x = sqrt(1. - velocity.y * velocity.y);

                float cosry = velocity.x / xz;
                float sinry = velocity.z / xz;

                float cosrz = x / xyz;
                float sinrz = velocity.y / xyz;

                mat3 maty =  mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
                mat3 matz =  mat3(cosrz , sinrz, 0, -sinrz, cosrz, 0, 0, 0,1);

                newPosition =  maty * matz * newPosition;
                newPosition += pos;

                vec3 transformed = vec3(newPosition);
            `;

            // Insert GLSL into the shader. 
            shader.vertexShader = shader.vertexShader.replace(token, insert);

            // Save shader to be accessed later in animate()
            this.pigeonShader = shader;
        };

        // Use the BufferGeometry + MeshStandardMaterial (overridden) to create a mesh. 
        const birdMesh = new THREE.Mesh(geometry, geoMaterial);
        birdMesh.rotation.y = Math.PI/2;
        birdMesh.castShadow = true;
        birdMesh.receiveShadow = true;
        
        scene.add(birdMesh);

        // Initialize GPUComputationRenderer
        this.gpuRenderer = new GPURenderer(renderer); 

        // All setup done, fire it away. 
        IsPigeonManagerReady = true;
        console.log('Pigeon Manager Ready'); 
    }

    // shootPigeon() {
    //     console.log('Pigeon Renderer: Shoot Pigeon');
        
    //     if (!this.isFlockInShock){
    //         // Remember where the previous states are
    //         this.previousSepValue = PigeonParams.Seperation;
    //         this.previousSpeedValue = PigeonParams.MaxSpeed;
    //         console.log(`Seperation value when shot : ${this.previousSepValue}`)
    //         // Increase separation and maxSpeed abruptly 
    //         PigeonParams.Seperation *= 2.5;
    //         PigeonParams.MaxSpeed *= 1.8;

    //         // // Reduce the pigeons. 
    //         if (PigeonParams.Count > 0) {
    //             this.shootCount++; 
    //             PigeonParams.Count = PigeonParams.Count - this.shootCount * KillFactor; 
    //         }
            
    //         this.isFlockInShock = true;
    //     }
    //     return this.isFlockInShock
    // }

    setNewPatternType(newPatternType) {
        this.patternManager.setTargetPattern(newPatternType);
        console.log('Setting pattern');
    }

    recoverFromShock() {
        if (PigeonParams.Seperation > this.previousSepValue){
            // Separation and max speed would decay overtime to recover from gun shot
            PigeonParams.Seperation *= 0.999;
            PigeonParams.MaxSpeed *= 0.999;
        } else {
            // Pigeons are recovered from gun shot, setting the params back to their previous values
            PigeonParams.Seperation = this.previousSepValue;
            PigeonParams.MaxSpeed = this.previousSpeedValue;
            console.log(`Seperation value after recovered : ${PigeonParams.Seperation}`)
            this.previousSepValue = 0.0;
            this.previousSpeedValue = 0.0
            this.isFlockInShock = false;
        }        
    }
} 

export default PigeonManager;