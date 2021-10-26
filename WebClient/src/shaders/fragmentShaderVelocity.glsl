/*
  Name: fragmentShaderVelocity.js
  Author: Amay Kataria
  Date: 10/21/2021
  Description: Core shader responsible for everything related to how to the velocity of each pigeon in the flock changes. 
*/

/*
*   UNIFORMS
*/

// TIME
uniform float uTime;
uniform float uDelta;

// FLOCK
uniform float uAttractionForce;
uniform float uSeperationForce; 
uniform float uAlignmentForce;
uniform float uCohesionForce;
uniform float uSpeedLerp;

// TARGET
uniform vec3 uTargetPosition; 
uniform float uTargetRadius;

// SPEED
uniform float uMaxAgentSpeed; 

// BOUNDING BOX
uniform vec3 uBoundingBoxMin; 
uniform vec3 uBoundingBoxMax; 

// Resolution is passed by default from GPUComputationRenderer
// That is WIDTH x WIDTH, with which we initialized it. 
const float width = resolution.x;
const float height = resolution.y;

/*
* CONSTANTS
*/
const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;

/*
* GLOBAL VARIABLES 
* Reused across the shader. 
*/
vec3 acceleration = vec3(0.0);
vec3 selfPosition, selfVelocity; 

// A simple random function. 
float rand(vec2 co){
    return fract(sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453);
}

// 2D rot matrix. 
mat2 get2dRotateMatrix(float _angle) {
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

vec3 updateTargetPosition() {
    mat2 rotateMatrix = get2dRotateMatrix(-PI/2.0); 
    vec3 newTargetPosition = uTargetPosition; 
    newTargetPosition.xz = rotateMatrix * newTargetPosition.xz; 
    return newTargetPosition; 
}

bool containsPoint(vec3 point) {
    return point.x < uBoundingBoxMin.x || point.x > uBoundingBoxMax.x ||
			point.y < uBoundingBoxMin.y || point.y > uBoundingBoxMax.y ||
			point.z < uBoundingBoxMin.z || point.z > uBoundingBoxMax.z ? false : true;
}

vec3 boundingBoxCheck(vec3 newVelocity) {
    bool contains = containsPoint(selfPosition);

    if (contains == true) {
        // Don't do anything
    } else {
        // Reflect back towards center. 
        vec3 dir = vec3(0.) - selfPosition;
        newVelocity = normalize(dir) * uMaxAgentSpeed;
    }

    return newVelocity; 
}

vec3 updateBehavior() {   
    float zoneRadius = uSeperationForce + uAlignmentForce + uCohesionForce;
    float seperationThresh = uSeperationForce / zoneRadius;
    float alignmentThresh = (uSeperationForce + uAlignmentForce) / zoneRadius;
    float cohesionThresh = 1.0 - alignmentThresh; 
    float zoneRadiusSquared = zoneRadius * zoneRadius;

    // Alignment, cohesion, seperation. 
    vec3 neighborPos, neighborVel; 
    vec3 newVelocity = selfVelocity; 
    for (float y = 0.0; y < height; y++) {
        for (float x = 0.0; x < width; x++) {
            vec2 ref = vec2(x, y) / resolution.xy; 
            vec3 neighborPos = texture2D(texturePosition, ref).xyz;
            vec3 neighborVel = texture2D(textureVelocity, ref).xyz; 

            vec3 dir = neighborPos - selfPosition;
            float dist = length(dir);

            // Am I comparing to myself? Pass then. 
            if (dist < 0.0001) { 
                continue;
            }

            // Is this Agent outside my zone radius? Pass then. 
            float distSquared = dist * dist;
            if (distSquared > zoneRadiusSquared) {
                continue;
            } else {
                // How much in my zone is it? 
                float neighborThresh = (distSquared / zoneRadiusSquared); 

                // Within seperation threshold? 
                // Move apart for comfort.
                if (neighborThresh < seperationThresh) {
                    float f = (seperationThresh / neighborThresh - 1.0) * uDelta;
                    newVelocity -= normalize(dir) * (f);
                } else if (neighborThresh < alignmentThresh) { 
                    // Within alignment threshold, align with neighbor. 
                    float threshDelta = alignmentThresh - seperationThresh; 
                    float adjustedThresh = (neighborThresh - seperationThresh) / threshDelta; 
                    float f = (0.5 - cos(adjustedThresh * PI_2) * 0.5 + 0.5) * uDelta; 
                    newVelocity += normalize(neighborVel) * f; 
                } else if (neighborThresh < cohesionThresh) {
                    // Attraction / Cohesion - move closer.
                    float threshDelta = cohesionThresh - alignmentThresh; 
                    float adjustedThresh = (neighborThresh - alignmentThresh) / threshDelta;
                    float f = (0.5 - (cos(adjustedThresh * PI_2) * -0.5 + 0.5)) * uDelta;
                    newVelocity += normalize(dir) * f;
                }
            }
        }
    }

    return newVelocity; 
}

void main() {
    // gl_FragCoord are pixel coordinates, but we need textureCoordinates
    // to access the actual texel from the texture. We use this formula to
    // calculate texture coordinate using resolution that is sent by default 
    // to the shader. 
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // texturePosition, textureVelocity are data textures sent as we added them
    // as dependencies while initializing our GPUComputationRenderer. 
    // This is the position (x, y, z) and velocity (x, y, z) for each bird, all being 
    // calculated and operated on in parallel. 
    selfPosition = texture2D(texturePosition, uv).xyz;
    selfVelocity = texture2D(textureVelocity, uv).xyz;

    // Adjust target position. 
    vec3 updatedTargetPos = updateTargetPosition();

    // Cohesion, Seperation, Alignment
    vec3 newVelocity = updateBehavior(); 

    // Moving target response. 
    vec3 dirToTarget = updatedTargetPos - selfPosition; 
    float distToTarget = length(dirToTarget);
    if (distToTarget < uTargetRadius) {
        float f = (1.0 - (distToTarget / uTargetRadius)) *  uAttractionForce;
        newVelocity += normalize(dirToTarget) * f; 
    }

    // Check if agent is in bounding box. 
    newVelocity = boundingBoxCheck(newVelocity); 

    // Clamp velocity. 
    if (length(newVelocity) > uMaxAgentSpeed) {
        newVelocity = normalize(newVelocity) * uMaxAgentSpeed;
    }

    // Final velocity lerp.
    newVelocity = mix(newVelocity, selfVelocity, uDelta * 0.001);

    // Output a velocity that is stored in the texture. 
    gl_FragColor = vec4(newVelocity, 1.0);
}

    // vec3 attractVel = attract(); 
    // attractVel.y *= 50.0;
    // newVelocity = newVelocity + attractVel;

    // vec3 repelVel = repel(updatedTargetPos); 
    // newVelocity = newVelocity + repelVel; 

                    // if (threshDelta == 0.0) {
                //     adjustedThresh = 1.0; 
                // } else {
                //     adjustedThresh = (neighborThresh - alignmentThresh) / threshDelta; 
                // }

        // // Attract flocks to the center
    // // Could this be our target??
    // vec3 central = vec3(0., 0., 0.);
    // vec3 dir = selfPosition - central;
    // float dist = length(dir);
    
    // dir.y *= 2.5;
    // newVelocity += normalize( dir ) * uDelta * 5.;

//     void seek(vec3 targetPos) {
//     vec3 vDesired = targetPos - selfPosition; 
//     vDesired = normalize(vDesired) * uAttractionForce; 
//     // Update acceleration.
//     acceleration = acceleration + vDesired; 
// }

// vec3 attract() {
//     vec3 vDesired = vec3(0.0) - selfPosition; 
//     vDesired = normalize(vDesired) * uAttractionForce; 
//     return vDesired; 
// }

// vec3 repel(vec3 targetPos) {
//     float preyRadius = 200.0;
//     float preyRadiusSq = preyRadius * preyRadius;

//     vec3 dir = targetPos - selfPosition; 
//     float dist = length(dir); 
//     float distSquared = dist * dist; 

//     // move birds away from predator
//     if (dist < preyRadius ) {
//         float f = (distSquared / preyRadiusSq - 1.0 ) * uDelta * 100.;
//         vec3 vDesired = normalize(dir) * f;
//         return vDesired;
//     } else {
//         return vec3(0.0); 
//     }
// }