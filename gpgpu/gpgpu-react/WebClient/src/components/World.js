import React from 'react'
import Radium from 'radium'
import * as THREE from 'three'
import oc from 'three-orbit-controls'
import Stats from 'stats.js'

// Shader import
import vertex from '../shaders/test/vertex.glsl'
import fragment from '../shaders/test/fragment.glsl'

const OrbitControls = oc(THREE);  

const styles = {
    container: {
        // position: 'absolute',
        zIndex: 0,
        top: '0%',
        overflowX: 'hidden',
        overflowY: 'auto'
    },

    button: {
      backgroundColor: 'red',
      position: 'absolute',
      top: '20px',
      zIndex: 1
    }
};

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };

    this.ref = React.createRef(); 
    
    this.scene = new THREE.Scene(); 
    // (FOV, AspectRatio, Near Clipping, Far Clipping)
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.05, 20000);
    this.camera.position.set(0, 2, 2); 
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.frustumCulled = false; 

    // Renders the scene as a canvas element. 
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    }); 

    this.controls = new OrbitControls(this.camera); 

    this.stats = new Stats(); 

    this.clock = new THREE.Clock();

    this.material = ''; 

    this.setupScene(); 
  }

  componentDidMount() {
    // Set renderer properties
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding; 

    // Mount the canvas at the current div. 
    this.ref.current.appendChild(this.renderer.domElement); 
    this.ref.current.appendChild(this.stats.dom);

    // -------- Lighting ----------------
    var ambientLight = new THREE.AmbientLight(0xD7D3D3);
    ambientLight.intensity = 1.5;
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 3.0;
    directionalLight.position.set(0, 50, 50).normalize();
    // this.scene.add( ambientLight );
    // this.scene.add(directionalLight);	

    // ---------- Camera -------------------
    this.controls.enablePan = true;
    // controls.autoRotate = true; 
    // controls.autoRotateSpeed = 0.1;
    this.controls.enabled = true; 
    this.controls.enableKeys = false;

    this.initThreeRender(); 
  }

  render() {
    return (
      <div style={styles.container} ref={this.ref} />
    );
  }

  setupScene() {
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const vertexCount = geometry.attributes.position.count;

    const colors = new Float32Array(vertexCount * 3); 
    for (let i = 0; i < colors.length; i++) {
      colors[i] = Math.random(); 
    }

    // Add a new attribute to the Plane geometry and access it within 
    // the shader. 
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); 

    // const material = new THREE.MeshBasicMaterial({ color: 'red'});
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      defines: {
        USE_COLOR: true
      },
      uniforms: {
        uTime: { value: 0 }
      },
      wireframe: false
    }); 

    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);
  }

  update() {
    if (this.material  !== '') {
      // Make sure the uniform.value is updated here, else the unifrom 
      // is not receiving the updated value.
      this.material.uniforms.uTime.value = this.clock.getElapsedTime();
      console.log(this.clock.getElapsedTime())
    }
  }

  initThreeRender() {
    // Render loop. 
    this.stats.begin();
    this.controls.update();
    this.update(); 
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initThreeRender.bind(this)); 
  }
}

export default Radium(World);