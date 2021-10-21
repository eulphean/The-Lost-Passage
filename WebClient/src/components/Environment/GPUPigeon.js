/*
  Author: Amay Kataria
  Date: 10/21/2021
  Title: GPUPigeon.js
  Description: A class that loads the pigeon geometry and prepares it as the 
  buffer geometry to be sent to the GPU. 
*/

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import model from '../../models/pigeon_back.glb'; 

// WIDTH - Determines the max birds that can be created. 
export const WIDTH = 50; 
export const BIRDS = WIDTH * WIDTH; 

class GPUPigeon {
    constructor(onFinishedCallback) {
        // Declare all the variables that I need to access. 
        this.durationAnimation = ''; 
        this.vertexPerBird = '';
        this.indicesPerBird = '';
        this.textureAnimation = ''; 
        this.birdGeometry = new THREE.BufferGeometry(); 

        // Maybe call this once the GUI is ready. 
        // ONCE the GUI variables are available, then 
        // we call this. 
        this.loadPigeon(onFinishedCallback); 
    }

    loadPigeon(onFinishedCallback) {
        let loader = new GLTFLoader(); 
        loader.load(model, (gltf) => {
            // Animation 
            const animations = gltf.animations;
            this.durationAnimation = Math.round(animations[0].duration * 60);

            // Geometry
            const birdGeo = gltf.scene.children[0].geometry;

            // All the morph positions. There are 8 targets for this geometry
            // Each position contains the actual positions of each vertex. 
            const morphAttributes = birdGeo.morphAttributes.position;    

            this.vertexPerBird = birdGeo.getAttribute('position').count;
            this.indicesPerBird = birdGeo.index.array.length; 

            // Prepare animation texture. 
            const tHeight = this.nextPowerOf2(this.durationAnimation);
            const tWidth = this.nextPowerOf2(this.vertexPerBird);
            // Every vertex has (x, y, z) coords so mult by 3. 
            const tData = new Float32Array(3 * tWidth * tHeight); 

            for ( let i = 0; i < tWidth; i ++ ) {
                for ( let j = 0; j < tHeight; j ++ ) {
                    const offset = j * tWidth * 3;
        
                    const curMorph = Math.floor(j / this.durationAnimation * morphAttributes.length);
                    const nextMorph = (curMorph + 1) % morphAttributes.length;
                    const lerpAmount = j / this.durationAnimation * morphAttributes.length % 1;
        
                    // Only fill animation data up till duration of animation. 
                    if (j < this.durationAnimation) {
                        // d0, d1 are actual vertex positions in the morphAttributes
                        let d0, d1; 
        
                        // For the duration of the animation, we calculate the transition
                        // between the morph positions at each duration and store it in tData
                        // tData contains the vertex position at each duration of an animation 
                        // for a single bird. 
                        d0 = morphAttributes[curMorph].array[i * 3];
                        d1 = morphAttributes[nextMorph].array[i * 3];
        
                        if (d0 !== undefined && d1 !== undefined) 
                            tData[offset + i * 3] = this.lerp(d0, d1, lerpAmount);
        
                        d0 = morphAttributes[ curMorph ].array[ i * 3 + 1 ];
                        d1 = morphAttributes[ nextMorph ].array[ i * 3 + 1 ];
        
                        if (d0 !== undefined && d1 !== undefined) 
                            tData[offset + i * 3 + 1] = this.lerp(d0, d1, lerpAmount);
        
                        d0 = morphAttributes[curMorph].array[i * 3 + 2];
                        d1 = morphAttributes[nextMorph].array[i * 3 + 2];
        
                        if (d0 !== undefined && d1 !== undefined) 
                            tData[offset + i * 3 + 2] = this.lerp(d0, d1, lerpAmount);
                    }
                }
            }
            
            // Here we define our Data texture based on the tData that we just prepared. 
            // DataTexture is inherited from Texture (this is how a texture is internally stored in Three.js)
            this.textureAnimation = new THREE.DataTexture(tData, tWidth, tHeight, THREE.RGBFormat, THREE.FloatType);
            // textureAnimation.needsUpdate = false; // Don't need this since texture is not updating

            // Prepare the BUFFER GEOMETRY. 
            const vertices = [], color = [], reference = [], seeds = [], indices = [];
            const totalVertices = this.vertexPerBird * BIRDS * 3; // TOTAL VERTICES IN THE SCENE. 

            // NOTE: Blender exports color attribute with RGBA. We need to filter out
            // Alpha values from it and just use 3 channel color. 
            let birdColArray = birdGeo.getAttribute('color').array; 
            let newBirdColArray = []; 
            let skip = 3; 
            for (let i = 0, j = 0; i < birdColArray.length; i++) {
                if (i % skip === 0 && i !== 0) {
                    // Skip alpha from the array.
                    skip = skip + 4; 
                } else {
                    newBirdColArray[j] = birdColArray[i];
                    j++; 
                }
            }

             // Prepare color and vertices attribute for the buffer. 
            // This buffer geometry is a collection of all the vertices 
            // of birds that are in the scene. So it's a single geometry that will be
            // renderered per frame. Thus, Draw Call = 1
            for (let i = 0; i < totalVertices; i ++ ) {
                const bIndex = i % (this.vertexPerBird * 3);
                vertices.push(birdGeo.getAttribute('position').array[bIndex]);
                color.push(newBirdColArray[bIndex]);
            }

            // Seeds & References are for Animation of each bird. 
            // It's some strange arithmetic that I don't understand.
            // But it's necessary to store the index of each frame in the animation. 
            // It's solid and we don't have to touch it at all.
            let r = Math.random();
            for (let i = 0; i < this.vertexPerBird * BIRDS; i ++) {
                const bIndex = i % (this.vertexPerBird);
                const bird = Math.floor(i / this.vertexPerBird);
                if (bIndex == 0) r = Math.random();
                const j = ~ ~ bird;
                const x = (j % WIDTH) / WIDTH;
                const y = ~ ~ (j / WIDTH) / WIDTH;
                reference.push(x, y, bIndex / tWidth, this.durationAnimation / tHeight);
                seeds.push(bird, r, Math.random(), Math.random());
            }

            // We need to push the indices for each bird that is getting added to this geometry. 
            // Incoming geometry has an index array that represents something realted to the vertices 
            // of the triangles that are added to the geometry. 
            for (let i = 0; i < this.indicesPerBird * BIRDS; i++) {
                const offset = Math.floor(i / this.indicesPerBird) * this.vertexPerBird * 3; // CRITICAL FIX: Contribute back to Three.js
                indices.push(birdGeo.index.array[i % this.indicesPerBird] + offset);
            }

            this.birdGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            // Don't need this - we are not doing anything with it in the shader for now. 
            // BirdGeometry.setAttribute('birdColor', new THREE.BufferAttribute( new Uint16Array( color ), 3,true)); 
            this.birdGeometry.setAttribute('color', new THREE.BufferAttribute(new Uint16Array(color), 3, true));
            this.birdGeometry.setAttribute('reference', new THREE.BufferAttribute(new Float32Array(reference), 4));
            this.birdGeometry.setAttribute('seeds', new THREE.BufferAttribute(new Float32Array(seeds), 4));
            this.birdGeometry.setIndex(indices);

            // This is done loading, so now I can init
            // full pigeons. 
            onFinishedCallback(); 
        });
    }

    nextPowerOf2(n) {
        return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
    }
    
    lerp(value1, value2, amount) {
        amount = Math.max(Math.min( amount, 1 ), 0);
        return value1 + (value2 - value1) * amount;
    }

    setDrawRange(count) {
        this.birdGeometry.setDrawRange(0, this.indicesPerBird * count);
    }
}

export default GPUPigeon; 