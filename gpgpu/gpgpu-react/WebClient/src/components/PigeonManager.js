// Loads the pigeon and makes everything else available pertaining to pigeon.  
// Manages everything related to the pigeons. 
// Maybe we'll have the GPUComputationRenderer here. 

import * as THREE from 'three';
import Pigeon from "./Pigeon";
import GPURenderer from "./GPURenderer";

class PigeonManager {
    constructor(renderer, scene, effectController) {
        // Load model and setup geometry. 
        this.pigeon = new Pigeon(this.initPigeons.bind(this, scene, effectController));

        // Initialize GPUComputation.
        this.gpuRenderer = new GPURenderer(renderer, effectController); 

        // Shader to set the uniforms on.
        this.pigeonShader = ''; 

        this.clock = new THREE.Clock(); 
    }

    initPigeons(scene, effectController) {
        console.log('Init Pigeons');

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
            shader.uniforms.texturePosition = { value: null }; // Update in animate()
            shader.uniforms.textureVelocity = { value: null }; // Update in animate()
            // TextureAnimation is DataTexture for the animation that we prepared when loading our geometry. 
            shader.uniforms.textureAnimation = { value: this.pigeon.textureAnimation }; // Never have to update again.
            shader.uniforms.time = { value: 1.0 }; // Update in animate()
            shader.uniforms.size = { value: effectController.size }; // Update in animate()
            shader.uniforms.delta = { value: 0.0 }; // update in animate()

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

        console.log('Hello');
        console.log(this.pigeon.textureAnimation);
        
        scene.add(birdMesh);
    }

    update() {
        let delta = this.clock.getDelta();
        let now = this.clock.oldTime;

        // Computer GPU values. 
        this.gpuRenderer.update(delta, now); 

        // Bird material's uniform value that is changing every frame. 
        if (this.pigeonShader) {
            this.pigeonShader.uniforms["time"].value = now / 1000;
            this.pigeonShader.uniforms["delta"].value = delta;

               // Extract the data textures for Position and Velocity from GPURenderer and set it to the uniforms
            // of the bird's material to set the new location of the vertices in the BufferGeometry. 
            this.pigeonShader.uniforms["texturePosition"].value = this.gpuRenderer.getPositionRenderTarget();
            this.pigeonShader.uniforms["textureVelocity"].value = this.gpuRenderer.getVelocityRenderTarget();
        }
    }

    updateUniforms(effectController) {
        if (this.pigeonShader) {
            this.pigeonShader.uniforms['size'].value = effectController.size; 
        }

        this.pigeon.setDrawRange(effectController.count); 

        if (this.gpuRenderer) {
            this.gpuRenderer.updateUniforms(effectController); 
        }
    }
}

export default PigeonManager; 

// const geometry = BirdGeometry;

// // simple standard material, which we will override to animate all the geometry
// // that has been assigned into Bird Geometry. 
// const geoMaterial = new THREE.MeshStandardMaterial({
//     vertexColors: true,
//     flatShading: true,
//     side: THREE.DoubleSide,
//     roughness: 0,
//     metalness: 0
// });

// // Shader hook - to add some content before we actually compile
// // the MeshStandardMaterial. We get access to the actual MeshStandard
// // shader in this hook. 
// geoMaterial.onBeforeCompile = (shader) => {
//     // Add uniforms to the shader that will be used. 
//     // Some uniforms are changing in every frame like texturePosition
//     // and textureVelocity, so we update that in animate().
//     shader.uniforms.texturePosition = { value: null }; // Update in animate()
//     shader.uniforms.textureVelocity = { value: null }; // Update in animate()
//     // TextureAnimation is DataTexture for the animation that we prepared when loading our geometry. 
//     shader.uniforms.textureAnimation = { value: textureAnimation }; // Never have to update again.
//     shader.uniforms.time = { value: 1.0 }; // Update in animate()
//     shader.uniforms.size = { value: effectController.size }; // Update in animate()
//     shader.uniforms.delta = { value: 0.0 }; // update in animate()

//     // Replace token with token + insert. 
//     let token = '#define STANDARD';
//     let insert = /* glsl that we will insert after STANDARD */
//     `
//         attribute vec4 reference;
//         attribute vec4 seeds;
//         uniform sampler2D texturePosition;
//         uniform sampler2D textureVelocity;
//         uniform sampler2D textureAnimation;
//         uniform float size;
//         uniform float time;
//     `;

//     // Add GLSL in MaterialShader. 
//     shader.vertexShader = shader.vertexShader.replace( token, token + insert );

//     // Replace token with token + insert.
//     // NOTE: This shader is basically using positionData, velocityData, and animationData to update the position
//     // of each vertex in the Buffer Geometry. All the computation that happens on the GPU gets fed into this 
//     // calculation to update the position of each vertex in the BufferGeometry based on the position, velocity, and animation 
//     // frame that a bird is on. We don't need to touch this shader at all - This is rock solid. As we update the position and 
//     // velocity shaders, this should just do the right thing. 
//     token = '#include <begin_vertex>';
//     insert = /* glsl */
//     `
//         vec4 tmpPos = texture2D(texturePosition, reference.xy);

//         vec3 pos = tmpPos.xyz;
//         vec3 velocity = normalize(texture2D(textureVelocity, reference.xy).xyz);
//         vec3 aniPos = texture2D(textureAnimation, vec2(reference.z, mod(time + (seeds.x) * ((0.0004 + seeds.y / 10000.0) + normalize(velocity) / 20000.0), reference.w))).xyz;
//         vec3 newPosition = position;

//         newPosition = mat3(modelMatrix) * (newPosition + aniPos);
//         newPosition *= size + seeds.y * size * 0.2;

//         velocity.z *= -1.;
//         float xz = length(velocity.xz);
//         float xyz = 1.;
//         float x = sqrt(1. - velocity.y * velocity.y);

//         float cosry = velocity.x / xz;
//         float sinry = velocity.z / xz;

//         float cosrz = x / xyz;
//         float sinrz = velocity.y / xyz;

//         mat3 maty =  mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
//         mat3 matz =  mat3(cosrz , sinrz, 0, -sinrz, cosrz, 0, 0, 0,1);

//         newPosition =  maty * matz * newPosition;
//         newPosition += pos;

//         vec3 transformed = vec3(newPosition);
//     `;

//     // Insert GLSL into the shader. 
//     shader.vertexShader = shader.vertexShader.replace(token, insert);

//     // Save shader to be accessed later in animate()
//     materialShader = shader;
// };

// // Use the BufferGeometry + MeshStandardMaterial (overridden) to create a mesh. 
// birdMesh = new THREE.Mesh(geometry, geoMaterial);
// birdMesh.rotation.y = Math.PI/2;
// birdMesh.castShadow = true;
// birdMesh.receiveShadow = true;

// // Add mesh to scene. 
// scene.add(birdMesh);