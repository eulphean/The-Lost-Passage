	uniform float time;
    uniform float delta;
    
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
        phase = mod((phase + delta + length( velocity.xz ) * delta * 3. + max(velocity.y, 0.0 ) * delta * 6.), 62.83);

        gl_FragColor = vec4(position + velocity * delta * posInfluence, phase);
    }