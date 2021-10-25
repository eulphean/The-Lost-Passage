/*
  Name: PigeonManager.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: Container class that manages all the pigeons that are created in the world. 
*/

import * as THREE from 'three'

// import GPUPigeon from '../Environment/GPUPigeon.js'
import { PatternManager } from './PatternManager';
import Target from '../Environment/Target'
import GPUPigeon from '../Environment/GPUPigeon.js';
import { BIRDS } from '../Environment/GPUPigeon.js'
import GPURenderer from './GPURenderer.js';


// Set this to true when everything has been loaded. 
export let IsPigeonManagerReady = false; 

// PARAMS shared between GPURenderer 
// and PigeonManager. 
export let PigeonParams = {
    Attraction: 5.0,
    Seperation: 20.0,
    Alignment: 20.0,
    Cohesion: 20.0,
    Freedom: 0.75,
    MaxSpeed: 5.0,
    SpeedLerp: 0.1,
    Size: 0.2,
    Count: BIRDS
}

class PigeonManager {
    constructor(scene) {
        // Manages the moving target for the flock. 
        this.patternManager = new PatternManager(); 

        // Create the target object that the pigeons are following. 
        this.target = new Target(scene);

        // Clock, required for animation of the agents. 
        this.clock = new THREE.Clock(); 

        // Shader to set the uniforms on.
        this.pigeonShader = ''; 

        // GPURenderer
        this.gpuRenderer = '';
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

    update() {
        if (IsPigeonManagerReady) {
            let targetPosition = this.patternManager.update();

            // If we have a valid target position, begin updating.
            if (targetPosition) {
                let delta = this.clock.getDelta();
                let now = this.clock.oldTime;

                // Update target. 
                this.target.update(targetPosition, now);

                // Computer GPU values. 
                this.gpuRenderer.update(delta, now, targetPosition); 
                // Bird material's uniform value that is changing every frame. 
                if (this.pigeonShader) {
                    this.pigeonShader.uniforms["time"].value = now / 1000;
                    this.pigeonShader.uniforms["delta"].value = delta;

                    // Bing pigeon size.
                    this.pigeonShader.uniforms['size'].value = PigeonParams.Size; 

                    // Extract the data textures for Position and Velocity from GPURenderer and set it to the uniforms
                    // of the bird's material to set the new location of the vertices in the BufferGeometry. 
                    this.pigeonShader.uniforms["texturePosition"].value = this.gpuRenderer.getPositionRenderTarget();
                    this.pigeonShader.uniforms["textureVelocity"].value = this.gpuRenderer.getVelocityRenderTarget();
                }

                // Bind pigeon count.
                this.pigeon.setDrawRange(PigeonParams.Count); 
            }
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

    setNewPatternType(newPatternType) {
        this.patternManager.setTargetPattern(newPatternType);
        console.log('Setting pattern');
    }
} 

export default PigeonManager;

// UNUSED METHODS RIGHT NOW.
// NEED TO BRING ALL THIS BACK!!
// HOW, WHEN???
// setup(scene, currentPatternType) {
//     console.log('Pigeon Manager Pattern: ' + currentPatternType);
    
//     this.spawnPigeons(scene);

//     // Create the target object that the pigeons are following. 
//     this.target = new Target(scene);

//     // Create the target pattern.
//     this.patternManager.setTargetPattern(currentPatternType); 
// }

// update(boundingBox) {
//     // Do any pigeons exist? 
//     if (this.pigeons.length > 0) {
//         // Don't do anything until we have a valid target position. 
//         let patternPos = this.patternManager.update(); 
//         if (patternPos) {
//             this.target.setVector(patternPos);
//             this.target.setVisibility(TargetParams.ShowTarget);

//             // Update octree. 
//             // Note: On every update, we instantiate a new octree
//             // and populate it with the new pigeon position. So everytime, 
//             // the neighbors get updated. 
//             this.octreeManager.update(patternPos, this.pigeons); 

//             let nAgents = []; // Neighboring agents. 

//             // Delta change in time to advance the animation of the wings. 
//             let delta = this.clock.getDelta(); 
//             this.pigeons.forEach(p => {
//                 // Update the target's position 
//                 p.setTarget(patternPos); 
//                 // Find and update the location of neighboring agents
//                 nAgents = this.octreeManager.getNeighbours(p.position); 
//                 p.update(delta, nAgents, boundingBox);
//             });
//         }
        
//         // Slowly reset some of the agent params that was disturbed by the gun shot
//         this.recoverFromShock()
//     }
// }

// setNewPatternType(newPatternType) {
//     this.patternManager.setTargetPattern(newPatternType)
// }

// spawnPigeons(scene) {
//     // NOT IMPLEMENTED
//     // ISSUES IN CLEANING GEOMETRY!!
//     /// Empty the pigeons first. 
//     // if (this.pigeons.length > 0) {
//     //     scene.children.forEach(child => {
//     //         if (child.name === 'pigeon') {
//     //             child.remove(child[0]);
//     //         }
//     //     });
//     // }

//     // Instantiate pigeons again. 
//     for (let i = 0; i < NUM_PIGEONS; i++) {
//         let p = new Pigeon(scene); 
//         this.pigeons.push(p);
//     }
// }

// shootPigeon() {
//     console.log('Shoot Pigeon');
//     // Set one randome pigeon to be dead
//     let choseOne = THREE.MathUtils.randInt(0, this.pigeons.length - 1)
//     this.pigeons[choseOne].isAlive = false;
    
//     // Gun shot will scare them away
//     AgentParams.SeperationForce *= 3
//     AgentParams.AttractionForce *= 0.1
// }

// recoverFromShock() {
//     // Separation would decay overtime to recover from gun shot
//     AgentParams.SeperationForce *= 0.999;
//     AgentParams.SeperationForce = THREE.MathUtils.clamp(AgentParams.SeperationForce, 1.2, 2);      
    
//     // Agent would focus back on seeking target again
//     AgentParams.AttractionForce *= 1.001;
//     AgentParams.AttractionForce = THREE.MathUtils.clamp(AgentParams.AttractionForce, 0.5, 2);
// }