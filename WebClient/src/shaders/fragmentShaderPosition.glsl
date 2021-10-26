/*
  Name: fragmentShaderPosition.js
  Author: Amay Kataria
  Date: 10/21/2021
  Description: Core shader for updating the position of each pigeon in the flock. 
*/

uniform float uTime;
uniform float uDelta;
uniform bool uReset;

// This influence how quick the pigeon advances to the position. 
// Maybe bring this in from the GUI. 
float posInfluence = 15.0; 

float rand(vec2 co){
    return fract(sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453);
}

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

    vec3 newPosition = position + velocity * uDelta * 5.0;

    if (uReset == true) {
      float r = rand(position.xz);
      // newPosition = vec3(r * cos(r), r, r * sin(r)) * r * 100.0;
      newPosition = vec3(r, r, r);
    }
    
    gl_FragColor = vec4(newPosition, phase);
}