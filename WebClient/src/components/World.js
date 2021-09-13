/*
  Name: World.js
  Author: Amay Kataria
  Date: 08/19/2021
  Description: This is where Three.js world is initialized. It's the entry point for the three-dimensional 
  world and creating all elements. 
*/

import React from 'react'
import Radium from 'radium'
import * as THREE from 'three'
import oc from 'three-orbit-controls'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import Pigeon from './Pigeon.js'
import Target from './Target.js'

const OrbitControls = oc(THREE); 
export const WORLD_STATE = {
  PATTERN: 0,
  FLOCK: 1
}; 

const styles = {
  container: {
      // position: 'absolute',
      zIndex: 0,
      top: '0%',
      overflowX: 'hidden',
      overflowY: 'auto'
  }
};

// Gui Parameters. 
const guiParams = {
  showGrid: true,
  showTarget: true
};

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state={};

    // Pointer to the div that holds the Three.js world.
    this.ref = React.createRef(); 
    
    // 3D scene object where everything is added. 
    this.scene = new THREE.Scene(); 

    // Static setup that can happen after scene is initialized. 
    this.setupCamera();  
    this.setupProps(); 
    this.setupGui(); 
    this.setupLighting();
    this.setupRenderer(); 
    this.setupOrbitControls(); 

    // Create the pigeon. 
    this.pigeon = new Pigeon(this.scene);

    // Create the target object. 
    this.target = new Target(this.scene);

    // Other helpers. 
    this.stats = new Stats(); 
    this.clock = new THREE.Clock(); 
  }

  componentDidMount() {
    // Mount the canvas at the current div. 
    this.ref.current.appendChild(this.renderer.domElement); 
    this.ref.current.appendChild(this.stats.dom);

    this.initThreeRender(); 
  }

  // Called every animation frame. 
  update() {
    // Update everything in here. 
    this.grid.visible = guiParams.showGrid;
    this.target.setVisibility(guiParams.showTarget);

    // Update agent and its position. 
    var delta = this.clock.getDelta(); 
    this.pigeon.update(delta);

    let targetPos = this.pigeon.target; 
    this.target.setVector(targetPos);
  }

  // Render three.js world. 
  render() {
    return (
      <div style={styles.container} ref={this.ref} />
    );
  }

  initThreeRender() {
    // Render loop. 
    this.stats.begin();
    this.update(); 
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initThreeRender.bind(this)); 
  }

  setupRenderer() {
    // Core renderer. 
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    }); 
    this.renderer.setClearColor(0x118a1f, 1);    // Set renderer properties
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding; 
  }

  setupOrbitControls() {
    this.controls = new OrbitControls(this.camera); 
    this.controls.enablePan = true;
    // controls.autoRotate = true; 
    // controls.autoRotateSpeed = 0.1;
    this.controls.enabled = true; 
    this.controls.enableKeys = true;
  }

  setupCamera() {
    // Camera Setup
    // (FOV, AspectRatio, Near Clipping, Far Clipping)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.05, 20000);
    this.camera.position.set(4, 4, 4); 
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.frustumCulled = false; 
  }

  setupProps() {
    let defaultHeight = 0.25; 
    // Things on the ground
    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial( {color: 0x612C2C} );
      const box = new THREE.Mesh(geometry, material);      
      let r1 = this.getRandomArbitrary(-1, 1) * 8; 
      let r2 = this.getRandomArbitrary(-1, 1) * 8; 
      box.position.x = r1;
      box.position.z = r2; 
      box.position.y = defaultHeight;
      this.scene.add(box);
    }

    // Ground
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshBasicMaterial( {color: 0x52D764, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh(geometry, material); 
    plane.rotation.x = Math.PI/2;
    this.scene.add(plane);

    this.scene.add(new THREE.AxesHelper(30));
    // Definitely need the grid helper. 
    this.grid = new THREE.GridHelper(30, 10);
    this.scene.add(this.grid);
  }

  setupLighting() {
    // -------- Lighting ----------------
    var ambientLight = new THREE.AmbientLight(0xD7D3D3);
    ambientLight.intensity = 1.5;
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 3.0;
    directionalLight.position.set(0, 50, 50).normalize();
    this.scene.add(ambientLight);
    this.scene.add(directionalLight);	
  }

  setupGui() {
    this.gui = new dat.GUI();
    this.gui.add(guiParams, 'showGrid' ).name('Show Grid');
    this.gui.add(guiParams, 'showTarget').name('Show Target');
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
}

export default Radium(World);