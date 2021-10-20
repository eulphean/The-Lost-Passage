import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import fragmentShaderPosition from './shaders/gpgpu/fragmentShaderPosition.glsl'
import fragmentShaderVelocity from './shaders/gpgpu/fragmentShaderVelocity.glsl'

const birdPath = 'models/pigeon_back.glb';

/* TEXTURE WIDTH FOR SIMULATION */
const WIDTH = 50;

// MAX BIRDS
const BIRDS = WIDTH * WIDTH;

function nextPowerOf2(n) {
    return Math.pow(2, Math.ceil( Math.log( n ) / Math.log( 2 ) ) );
}

Math.lerp = function ( value1, value2, amount ) {
    amount = Math.max( Math.min( amount, 1 ), 0 );
    return value1 + ( value2 - value1 ) * amount;
};

/* BAKE ANIMATION INTO TEXTURE and CREATE GEOMETRY FROM BASE MODEL */
const BirdGeometry = new THREE.BufferGeometry();
let textureAnimation, durationAnimation, birdMesh, materialShader, vertexPerBird;

const colors = [0xccFFFF, 0xffdeff];
const sizes = [0.2, 0.1];
const selectModel = 0;
new GLTFLoader().load(birdPath, function (gltf) {
    // Animation 
    const animations = gltf.animations;
    durationAnimation = Math.round(animations[0].duration * 60);

    // console.log(animations)
    // console.log(durationAnimation);

    // Geometry
    const birdGeo = gltf.scene.children[0].geometry;
    console.log(birdGeo);

    // All the morph positions. There are 8 targets for this geometry
    // Each position contains the actual positions of each vertex. 
    const morphAttributes = birdGeo.morphAttributes.position;    
    // console.log(morphAttributes);

    vertexPerBird = birdGeo.getAttribute('position').count;

    // Prepare animation texture. 
    const tHeight = nextPowerOf2(durationAnimation);
    const tWidth = nextPowerOf2(vertexPerBird);
    // Every vertex has (x, y, z) coords so mult by 3. 
    const tData = new Float32Array(3 * tWidth * tHeight); 

    for ( let i = 0; i < tWidth; i ++ ) {
        for ( let j = 0; j < tHeight; j ++ ) {
            const offset = j * tWidth * 3;

            const curMorph = Math.floor(j/durationAnimation * morphAttributes.length);
            const nextMorph = (curMorph + 1) % morphAttributes.length;
            const lerpAmount = j/durationAnimation * morphAttributes.length % 1;

            // Only fill animation data up till duration of animation. 
            if (j < durationAnimation) {
                // d0, d1 are actual vertex positions in the morphAttributes
                let d0, d1; 

                // For the duration of the animation, we calculate how the transition
                // between the morph positions at each duration and store it in tData
                // tData contains the vertex position at each duration of an animation 
                // for a single bird. 
                d0 = morphAttributes[curMorph].array[i * 3];
                d1 = morphAttributes[nextMorph].array[i * 3];

                if (d0 !== undefined && d1 !== undefined) 
                    tData[offset + i * 3] = Math.lerp(d0, d1, lerpAmount);

                d0 = morphAttributes[ curMorph ].array[ i * 3 + 1 ];
                d1 = morphAttributes[ nextMorph ].array[ i * 3 + 1 ];

                if (d0 !== undefined && d1 !== undefined) 
                    tData[offset + i * 3 + 1] = Math.lerp(d0, d1, lerpAmount);

                d0 = morphAttributes[curMorph].array[i * 3 + 2];
                d1 = morphAttributes[nextMorph].array[i * 3 + 2];

                if (d0 !== undefined && d1 !== undefined) 
                    tData[offset + i * 3 + 2] = Math.lerp(d0, d1, lerpAmount);
            }
        }
    }

    // Here we define our Data texture based on the tData that we just prepared. 
    // DataTexture is inherited from Texture (this is how a texture is internally stored in Three.js)
    textureAnimation = new THREE.DataTexture(tData, tWidth, tHeight, THREE.RGBFormat, THREE.FloatType);
    // textureAnimation.needsUpdate = false; // Don't need this since texture is not updating

    // Prepare the BUFFER GEOMETRY. 
    const vertices = [], color = [], reference = [], seeds = [], indices = [];
    const totalVertices = vertexPerBird * BIRDS * 3; // TOTAL VERTICES IN THE SCENE. 

    // NOTE: Blender exports color attribute with RGBA. We need to filter out
    // Alpha values from it and just use 3 channel color. 
    let colArray = birdGeo.getAttribute('color').array; 
    let newColorArray = []; 
    let skip = 3; 
    for (let i = 0, j = 0; i < colArray.length; i++) {
        if (i % skip === 0 && i !== 0) {
            // Skip alpha from the array.
            skip = skip + 4; 
        } else {
            newColorArray[j] = colArray[i];
            j++; 
        }
    }

    // Prepare color and vertices attribute for the buffer. 
    // This buffer geometry is a collection of all the vertices 
    // of birds that are in the scene. So it's a single geometry that will be
    // renderered per frame. 
    for (let i = 0; i < totalVertices; i ++ ) {
        const bIndex = i % (vertexPerBird * 3);
        vertices.push(birdGeo.getAttribute('position').array[bIndex]);
        color.push(newColorArray[bIndex]);
    }

    // Seeds & References are for Animation of each bird. 
    // It's some strange arithmetic that I don't understand. 
    let r = Math.random();
    for (let i = 0; i < vertexPerBird * BIRDS; i ++) {
        const bIndex = i % (vertexPerBird);
        const bird = Math.floor(i/vertexPerBird);
        if (bIndex == 0) r = Math.random();
        const j = ~ ~ bird;
        const x = (j % WIDTH) / WIDTH;
        const y = ~ ~ (j / WIDTH) / WIDTH;
        reference.push(x, y, bIndex / tWidth, durationAnimation / tHeight);
        seeds.push(bird, r, Math.random(), Math.random());
    }

    // We need to push the indices for each bird that is getting added to this geometry. 
    // Incoming geometry has an index array that represents something realted to the verteices 
    // of the triangles that are added to the geometry. 
    for (let i = 0; i <birdGeo.index.array.length * BIRDS; i++) {
        const offset = Math.floor(i / birdGeo.index.array.length) * vertexPerBird;
        indices.push(birdGeo.index.array[i % birdGeo.index.array.length] + offset);
    }

    BirdGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    // Don't need this - we are not doing anything with it. 
    // BirdGeometry.setAttribute('birdColor', new THREE.BufferAttribute( new Uint16Array( color ), 3,true)); 
    BirdGeometry.setAttribute('color', new THREE.BufferAttribute(new Uint16Array(color), 3, true));
    BirdGeometry.setAttribute('reference', new THREE.BufferAttribute(new Float32Array(reference), 4));
    BirdGeometry.setAttribute('seeds', new THREE.BufferAttribute(new Float32Array(seeds), 4));
    BirdGeometry.setIndex(indices);
    
    // BUFFER GEOMETRY is prepared. 
    // ANIMATION is baked into texture. 

    // Time to initialize things. 
    init();
    animate();
});

let container, stats;
let camera, scene, renderer;
let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Used to setup initial positions. 
// Also on when the boids are disturbed. 
const BOUNDS = 10, BOUNDS_HALF = BOUNDS / 2;

let last = performance.now();
let clock = new THREE.Clock(); 

let gpuCompute;
let velocityVariable;
let positionVariable;
let positionUniforms;
let velocityUniforms;

function init() {
    // Element
    container = document.createElement('div');
    document.body.appendChild(container);

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 350;

    // Controls
    const controls = new OrbitControls(camera, container)
    controls.enableDamping = true

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffdeff);
    // No fog. 
    //scene.fog = new THREE.Fog( colors[ selectModel ], 100, 1000 );

    // LIGHTS
    const hemiLight = new THREE.HemisphereLight(0xffdeff, 0xffffff, 1.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0x00CED1, 0.6);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add(dirLight);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    initComputeRenderer();

    // Stats. 
    stats = new Stats();
    container.appendChild(stats.dom);

    // No touch enabled for mobile. 
    // Events.
    container.style.touchAction = 'none';
    container.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onWindowResize);

    // GUI. 
    const gui = new GUI();
    const effectController = {
        separation: 20.0,
        alignment: 20.0,
        cohesion: 20.0,
        freedom: 0.75,
        size: 0.2,
        count: BIRDS
    };

    // UI Input Binder. 
    const valuesChanger = function () {
        velocityUniforms["separationDistance"].value = effectController.separation;
        velocityUniforms["alignmentDistance"].value = effectController.alignment;
        velocityUniforms["cohesionDistance"].value = effectController.cohesion;
        velocityUniforms["freedomFactor"].value = effectController.freedom;
        if ( materialShader ) 
            materialShader.uniforms["size"].value = effectController.size;

        // Draw range culls the vertices that shouldn't be rendererd. 
        BirdGeometry.setDrawRange(0, vertexPerBird * effectController.count);
    };

    // Bind the uniforms or buffer geometry to UI inputs. 
    valuesChanger();

    gui.add(effectController, "separation", 0.0, 100.0, 1.0).onChange(valuesChanger);
    gui.add(effectController, "alignment", 0.0, 100, 0.001).onChange(valuesChanger);
    gui.add(effectController, "cohesion", 0.0, 100, 0.025).onChange(valuesChanger);
    gui.add(effectController, "size", 0, 1, 0.01).onChange(valuesChanger);
    gui.add(effectController, "count", 0, BIRDS, 1).onChange(valuesChanger);
    gui.close();

    initBirds(effectController);
}

// GPUComputationRenderer initialize. 
function initComputeRenderer() {
    // WIDTH, WIDTH (Width, Height) - Resolution of the computation
    // Renderer is the WebGL renderer. 
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

    if (isSafari()) {
        gpuCompute.setDataType(THREE.HalfFloatType);
    }

    // Textures for position and velocity computations. 
    // Each texture is WIDTH x WIDTH wide. Each texel holds 
    // 4 floats (RGBA) for computation. Array is divided in chunks of 4. 
    // This texture is of type THREE.DataTexture, which actually stores
    // the data of a Three.js Texture. 
    const dtPosition = gpuCompute.createTexture();
    const dtVelocity = gpuCompute.createTexture();
    fillPositionTexture(dtPosition);
    fillVelocityTexture(dtVelocity);

    // Variables are the ones that are actually undergoing computation in the GPURenderer. 
    // (VariableName, Shader, DataTexture)
    // Each variable contains 'material' property, which is of type THREE.ShaderMaterial
    velocityVariable = gpuCompute.addVariable("textureVelocity", fragmentShaderVelocity, dtVelocity);
    positionVariable = gpuCompute.addVariable("texturePosition", fragmentShaderPosition, dtPosition);

    // Set the dependencies between variables and their data textures will be available between each other. 
    // For example in fragmentShaderVelocity, the dataTexture for position is available. 
    gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

    // Retrieve uniforms from ShaderMaterial, so it can be populated with custom uniforms. 
    positionUniforms = positionVariable.material.uniforms;
    velocityUniforms = velocityVariable.material.uniforms;

    // Position uniforms. 
    // Add any uniforms to adjust position right here. 
    positionUniforms["time"] = {value: 0.0};
    positionUniforms["delta"] = {value: 0.0};

    // Velocity uniforms. 
    // Add any uniforms to adjust velocity right here. 
    velocityUniforms["time"] = { value: 1.0 };
    velocityUniforms["delta"] = { value: 0.0 };
    velocityUniforms["testing"] = { value: 1.0 };
    velocityUniforms["separationDistance"] = { value: 1.0 };
    velocityUniforms["alignmentDistance"] = { value: 1.0 };
    velocityUniforms["cohesionDistance"] = { value: 1.0 };
    velocityUniforms["freedomFactor"] = { value: 1.0 };
    velocityUniforms["predator"] = { value: new THREE.Vector3() };
    
    // Velocity variable.
    // Adding a define to use it in the shader. 
    velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);
    velocityVariable.wrapS = THREE.RepeatWrapping;
    velocityVariable.wrapT = THREE.RepeatWrapping;

    // Position variable. 
    positionVariable.wrapS = THREE.RepeatWrapping;
    positionVariable.wrapT = THREE.RepeatWrapping;

    // A simple test to make sure GPURenderer has everything. 
    const error = gpuCompute.init();

    if ( error !== null ) {
        console.error( error );
    }
}

function isSafari() {
    return !! navigator.userAgent.match( /Safari/i ) && ! navigator.userAgent.match( /Chrome/i );
}

function initBirds(effectController) {
    const geometry = BirdGeometry;

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
        shader.uniforms.textureAnimation = { value: textureAnimation }; // Never have to update again.
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
        materialShader = shader;
    };

    // Use the BufferGeometry + MeshStandardMaterial (overridden) to create a mesh. 
    birdMesh = new THREE.Mesh(geometry, geoMaterial);
    birdMesh.rotation.y = Math.PI/2;
    birdMesh.castShadow = true;
    birdMesh.receiveShadow = true;

    // Add mesh to scene. 
    scene.add(birdMesh);
}

// Starting positions. 
function fillPositionTexture(texture) {
    // Size of this array is actually WIDTH x WIDTH * 4;
    const theArray = texture.image.data;
    console.log(theArray);
    // Each texel is 4 floats. 
    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        // Can remove BOUNDS they are all emanate from the center. 
        // const x = Math.random() * BOUNDS;
        // const y = Math.random() * BOUNDS;
        // const z = Math.random() * BOUNDS;
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();

        // 4th. 
        theArray[k + 0] = x;
        theArray[k + 1] = y;
        theArray[k + 2] = z;
        theArray[k + 3] = 1;
    }
}

// Starting velocities. 
function fillVelocityTexture( texture ) {
    const theArray = texture.image.data;
    for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {
        const x = Math.random() - 0.5;
        const y = Math.random() - 0.5;
        const z = Math.random() - 0.5;

        theArray[k + 0] = x * 0.5;
        theArray[k + 1] = y * 0.5;
        theArray[k + 2] = z * 0.5;
        theArray[k + 3] = 1;
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerMove( event ) {
    if ( event.isPrimary === false ) return;
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    // const now = performance.now();
    // let delta = (now - last) / 1000;
    // console.log(delta);

    // if (delta > 1) delta = 1; // safety cap on large deltas
    // last = now;
    let delta = clock.getDelta();
    let now = clock.oldTime; 

    // GPGPU shader uniform values that are changing every frame. 
    positionUniforms["delta"].value = delta; 
    positionUniforms["time"].value = now;
    velocityUniforms["delta"].value = delta;
    velocityUniforms["time"].value = now;

    // Bird material's uniform value that is changing every frame. 
    if (materialShader) {
        materialShader.uniforms["time"].value = now / 1000;
        materialShader.uniforms["delta"].value = delta;
    }

    // Should the mouse influence the flock? Currently, disable it. 
    //velocityUniforms["predator"].value.set(0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0);
    mouseX = 10000;
    mouseY = 10000;

    // Compute velocity and position shaders and 
    // populate the vel and pos textures with new
    // values. 
    gpuCompute.compute();

    // Extract the data textures for Position and Velocity from GPURenderer and set it to the uniforms
    // of the bird's material to set the new location of the vertices in the BufferGeometry. 
    if (materialShader) {
        materialShader.uniforms["texturePosition"].value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
        materialShader.uniforms["textureVelocity"].value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture
    }

    renderer.render( scene, camera );
}