/*
  Name: fragmentShaderPosition.js
  Author: Amay Kataria
  Date: 10/21/2021
  Description: Core shader for updating the position of each pigeon in the flock. 
*/

uniform float uTime;
uniform float uDelta;

// This influence how quick the pigeon advances to the position. 
// Maybe bring this in from the GUI. 
float posInfluence = 15.0; 

void main()	{
    // Calculate texture coordinates from pixel coordinates (gl_FragColor)
    // resolution is passed as a default uniform, which is stored as WIDTH,
    // HEIGHT as initialized in GPUComputationRenderer.
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Store this to work on later. 
    vec4 tempPos = texture2D(texturePosition, uv); 
    vec3 position = tempPos.xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    // By default we set this 
    float phase = tempPos.w;
    phase = mod((phase + uDelta + length( velocity.xz ) * uDelta * 3. + max(velocity.y, 0.0 ) * uDelta * 6.), 62.83);

// position + velocity * delta * posInfluence
    gl_FragColor = vec4(position + velocity * uDelta * 5.0, phase);
}