import React from 'react'
import Radium from 'radium'
import * as THREE from 'three'
import oc from 'three-orbit-controls'
import Stats from 'stats.js'

import PigeonManager from './PigeonManager'

// Shader import
import vertex from '../shaders/test/vertex.glsl'
import fragment from '../shaders/test/fragment.glsl'

const OrbitControls = oc(THREE);  

const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
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

    // Scene. 
    this.scene = new THREE.Scene(); 

    // Camera 
    // (FOV, AspectRatio, Near Clipping, Far Clipping)
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.05, 20000);
    this.camera.position.set(0, 2, 2); 
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.frustumCulled = false; 

    // Orbit controls. 
    this.controls = new OrbitControls(this.camera); 

    // Renderer
    // Renders the scene as a canvas element. 
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    }); 

    // Stats
    this.stats = new Stats(); 

    // Clock
    this.clock = new THREE.Clock();

    // Create pigeonManager
    this.pigeonManager = new PigeonManager(); 
  }

  componentDidMount() {
    // Renderer properties.
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding; 

    // Mount the canvas at the current div. 
    this.ref.current.appendChild(this.renderer.domElement); 
    this.ref.current.appendChild(this.stats.dom);

    // Lights
    var ambientLight = new THREE.AmbientLight(0xD7D3D3);
    ambientLight.intensity = 1.5;
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 3.0;
    directionalLight.position.set(0, 50, 50).normalize();
    // this.scene.add( ambientLight );
    // this.scene.add(directionalLight);	

    // Camera
    this.controls.enablePan = true;
    this.controls.enabled = true; 
    this.controls.enableKeys = false;
    this.controls.enableDamping = true; 
    // controls.autoRotate = true; 
    // controls.autoRotateSpeed = 0.1;

    this.initThreeRender(); 
  }

  render() {
    return (
      <div style={styles.container} ref={this.ref} />
    );
  }


  update() {

  }

  initThreeRender() {
    // Render loop. 
    this.stats.begin();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initThreeRender.bind(this)); 
  }
}

export default Radium(World);