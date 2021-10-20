// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime; 

// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv; // Attribute coming from Three.js

varying vec2 vUv; 
varying float vElevation; 

// varying float vRandom; // Use v, a, u to define your uniforms. 

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float vElevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    vElevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1; 
    modelPosition.z += vElevation;  
    // modelPosition.z += aRandom * 0.1; 

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vUv = uv; 

    gl_Position = projectedPosition;
}