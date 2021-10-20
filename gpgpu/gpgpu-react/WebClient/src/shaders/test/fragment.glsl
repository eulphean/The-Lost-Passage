uniform float uTime; 
varying vec3 vColor; 

void main() {
    float colX = sin(uTime)  * vColor.x;
    float colY = sin(uTime) * vColor.y;
    float colZ = sin(uTime) * vColor.z; 
    gl_FragColor = vec4(colX, colY, colZ, 1.0);
}