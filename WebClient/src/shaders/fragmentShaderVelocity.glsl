/*
  Name: fragmentShaderVelocity.js
  Author: Amay Kataria
  Date: 10/21/2021
  Description: Core shader responsible for everything related to how to the velocity of each pigeon in the flock changes. 
*/

uniform float time;
uniform float delta;
uniform float separationDistance; 
uniform float alignmentDistance;
uniform float cohesionDistance;
uniform float freedomFactor;
uniform vec3 targetPosition; 
uniform float maxSpeed; 
uniform vec3 predator;
uniform float testing;

// Resolution is passed by default from GPUComputationRenderer
// That is WIDTH x WIDTH, with which we initialized it. 
const float width = resolution.x;
const float height = resolution.y;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;
// const float VISION = PI * 0.55;

float zoneRadius = 40.0;
float zoneRadiusSquared = 1600.0;

float separationThresh = 0.45;
float alignmentThresh = 0.65;

// Currently not getting used.
const float UPPER_BOUNDS = BOUNDS;
const float LOWER_BOUNDS = -UPPER_BOUNDS;

// A simple random function. 
float rand(vec2 co){
    return fract(sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453);
}

void main() {
    zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
    separationThresh = separationDistance / zoneRadius;
    alignmentThresh = (separationDistance + alignmentDistance) / zoneRadius;
    zoneRadiusSquared = zoneRadius * zoneRadius;

    // gl_FragCoord are pixel coordinates, but we need textureCoordinates
    // to access the actual texel from the texture. We use this formula to
    // calculate texture coordinate. 
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 birdPosition, birdVelocity;

    // This is the position (x, y, z) and velocity (x, y, z) for each bird, all being 
    // calculated and operated on in parallel. 
    vec3 selfPosition = texture2D(texturePosition, uv).xyz;
    vec3 selfVelocity = texture2D(textureVelocity, uv).xyz;

    float dist;
    vec3 dir; // direction
    float distSquared;

    float separationSquared = separationDistance * separationDistance;
    float cohesionSquared = cohesionDistance * cohesionDistance;

    float f;
    float percent;

    vec3 velocity = selfVelocity;

    // PREDATOR is basically our target point only right now. 
    // THIS COULD BE MOUSE COORDINATES THAT COULD disturb the flock. 
    // Originally that's what it was but I've disabled it for now. 
    dir = targetPosition - selfPosition;
    // dir.z = 0.;
    // dir.z *= 0.6;
    dist = length(dir);
    distSquared = dist * dist;

    float preyRadius = 15.0;
    float preyRadiusSq = preyRadius * preyRadius;

    // move birds away from predator
    if (dist < preyRadius ) {
        f = (distSquared / preyRadiusSq - 1.0) * delta * 75.;
        velocity += normalize(dir) * f;
        // limit += 5.0;
    }

    // if (testing == 0.0) {}
    // if ( rand( uv + time ) < freedomFactor ) {}

    // Attract flocks to the center
    // Could this be our target??
    dir = selfPosition - targetPosition;
    dist = length(dir);
    
    dir.y *= 2.5;
    velocity -= normalize(dir) * delta * 50.;

    // Compare the position and velocity of current bird with every
    // other bird in the system. This gives shader a O(n2) complexity. 
    // It's not the best. Currently we use octree in Javascript side but
    // this is giving a really good performance, since this happens in parallel
    // across all the birds. Else, it would be O(n3), which would be worse. 
    for ( float y = 0.0; y < height; y++ ) {
        for ( float x = 0.0; x < width; x++ ) {
            vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
            birdPosition = texture2D(texturePosition, ref).xyz;

            dir = birdPosition - selfPosition;
            dist = length(dir);

            if (dist < 0.0001) continue;

            distSquared = dist * dist;

            if (distSquared > zoneRadiusSquared) continue;

            percent = distSquared / zoneRadiusSquared;

            if (percent < separationThresh) { // low
                // Separation - Move apart for comfort
                f = (separationThresh / percent - 1.0) * delta;
                velocity -= normalize(dir) * f;

            } else if (percent < alignmentThresh) { // high
                // Alignment - fly the same direction
                float threshDelta = alignmentThresh - separationThresh;
                float adjustedPercent = ( percent - separationThresh ) / threshDelta;

                birdVelocity = texture2D(textureVelocity, ref).xyz;

                f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;
                velocity += normalize(birdVelocity) * f;

            } else {
                // Attraction / Cohesion - move closer
                float threshDelta = 1.0 - alignmentThresh;
                float adjustedPercent;
                if (threshDelta == 0.) adjustedPercent = 1.;
                else adjustedPercent = (percent - alignmentThresh) / threshDelta;
                f = (0.5 - (cos( adjustedPercent * PI_2) * -0.5 + 0.5)) * delta;
                velocity += normalize(dir) * f;
            }
        }
    }

    // this make tends to fly around than down or up
    if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

    // Speed Limits
    if (length(velocity) > maxSpeed ) {
        velocity = normalize(velocity) * maxSpeed;
    }

    // Output a velocity that is stored in the texture. 
    gl_FragColor = vec4(velocity, 1.0);
}