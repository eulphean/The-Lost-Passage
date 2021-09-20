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
import { agentParams } from './Agent.js'
import Target from './Target.js'
import Terrain from './Terrain.js'
import {EllipsePattern, ellipseConstructor} from './PatternManager'
import { OctreeManager } from './OctreeManager.js'

const OrbitControls = oc(THREE); 
const Raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); 

export const WORLD_STATE = {
  PATTERN: 0,
  FLOCK: 1
}; 
const NUM_PIGEONS = 50; 

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
const worldParams = {
  showGrid: true,
  showTarget: true
};

let ellipseParams = {
  height: 6,
  radiusX: 10,
  radiusZ:  10,
  amplitude: 0,
  speed: 0.3
}

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

    // Create the target object. 
    this.target = new Target(this.scene);

    // Other helpers. 
    this.stats = new Stats(); 
    this.clock = new THREE.Clock(); 

    this.setupPattern();
    this.octreeManager = new OctreeManager();
    
    this.pigeons = []; 
  }

  componentDidMount() {
    // Mount the canvas at the current div. 
    this.ref.current.appendChild(this.renderer.domElement); 
    this.ref.current.appendChild(this.stats.dom);

    // Pigeon Geometry. 
    for (let i = 0; i < NUM_PIGEONS; i++) {
      // Create these pigeons at random locations from each other
      // But within some radius. 
      let p = new Pigeon(this.scene); 
      this.pigeons.push(p);
    }

    this.initThreeRender(); 

    window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
    window.addEventListener('click', this.onClick.bind(this), true)
  }

  // Called every animation frame. 
  update() {
    // Update everything in here. 
    //this.grid.visible = guiParams.showGrid;
    this.target.setVisibility(worldParams.showTarget);

    // Update agent and its position. 
    var delta = this.clock.getDelta(); 

    // Pattern's position. 
    this.ellipsePattern.update();
    let patternPos = this.ellipsePattern.getTargetPos();

    // Update octree. Note: On every update, we instantiate a new octree
    // and populate it with the new pigeon position. So everytime, 
    // the neighbors get updated. 
    this.octreeManager.update(patternPos, this.pigeons); 

    let nAgents = []; // Neighboring agents. 
    this.pigeons.forEach(p => {

      // Update the target's position 
      p.setTarget(patternPos); 

      // Find and update the location of neighboring agents
      nAgents = this.octreeManager.getNeighbours(p.position); 
      p.update(delta, nAgents, agentParams);
    });

    // Set the target object's position. 
    this.target.setVector(patternPos);

    // console.log(this.camera.position);
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
    this.renderer.setClearColor(0x0b5213, 1);    // Set renderer properties
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding; 
  }

  setupOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.render.domElement); 
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
    this.terrain = new Terrain(this.scene); 
    //this.scene.add(new THREE.AxesHelper(30));
    // Definitely need the grid helper. 
    //this.grid = new THREE.GridHelper(30, 10);
    // this.scene.add(this.grid);
  }

  setupLighting() {
    // -------- Lighting ----------------
    var ambientLight = new THREE.AmbientLight(0xD7D3D3);
    ambientLight.intensity = 0.5;
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 1.0;
    directionalLight.position.set(0, 100, 0).normalize();
    //this.scene.add(ambientLight);
    this.scene.add(directionalLight);	
  }

  // TODO: Tie the gui params to the actual parameters.
  setupGui() {
    this.gui = new dat.GUI();
    let worldFolder = this.gui.addFolder('World Params');
    worldFolder.add(worldParams, 'showGrid' ).name('Show Grid');
    worldFolder.add(worldParams, 'showTarget').name('Show Target');
    
    // Expose some agent params to the UI 
    let agentFolder = this.gui.addFolder('Agent Params');
    agentFolder.add(agentParams, 'maxForce').name('Max Force').min(0.005).max(0.1).step(0.005);
    agentFolder.add(agentParams, 'maxSpeed').name('Max Speed').min(0.005).max(1).step(0.005);
    agentFolder.add(agentParams, 'smoothFactor').name('Smooth Factor').min(0.005).max(0.1).step(0.005);

    let ellipseFolder = this.gui.addFolder('Ellipse Params'); 
    
    // Height
    ellipseFolder.add(ellipseParams, 'height').name('Height')
    .min(5).max(15).step(0.5)
    .onFinishChange(this.onFinishEllipseParams.bind(this));

    // RadiusX
    ellipseFolder.add(ellipseParams, 'radiusX').name('RadX')
    .min(5).max(20).step(0.5)
    .onFinishChange(this.onFinishEllipseParams.bind(this));

    // RadiusZ
    ellipseFolder.add(ellipseParams, 'radiusZ').name('RadZ')
    .min(5).max(20).step(0.5)
    .onFinishChange(this.onFinishEllipseParams.bind(this)); 
  }

  onFinishEllipseParams(v) {
    // Create a data package and send 
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  setupPattern() {
    let pos = new THREE.Vector3(0, 6, 0); // Target position
    let radX = 10; 
    let radZ = 10;
    let amp = 0; 
    let dir = true; 
    let moveFactor = THREE.Math.degToRad(0.3); 
    let patternObj = ellipseConstructor(pos, radX, radZ, amp, dir, moveFactor); 
    this.ellipsePattern = new EllipsePattern(patternObj); 
  }

  
  onMouseMove(event) {
    //mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    //mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log(mouse.x + ', ' + mouse.y);
  }

  onClick(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    Raycaster.setFromCamera(mouse, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = Raycaster.intersectObject(this.terrain.getMesh(), true);
    for (let i = 0; i < intersects.length; i ++) {
      //intersects[ i ].object.material.color.set( 0xff0000 );
    }
    console.log('Mouse Clicked');
  }
}

export default Radium(World);