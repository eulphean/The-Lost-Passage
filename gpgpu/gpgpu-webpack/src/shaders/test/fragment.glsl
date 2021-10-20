// precision mediump float;

// We pull the color uniform in fragment shader and get things done.
uniform vec3 uColor;
// This is just a Three.js texture.
uniform sampler2D uTexture; // The type for texture is sampler2D

varying vec2 vUv;
varying float vElevation;
// varying float vRandom;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 1.5; 
    gl_FragColor = textureColor;
}