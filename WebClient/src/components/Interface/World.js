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

// Utility components
// import Terrain from '../Environment/Terrain.js'
import CameraControl from '../Managers/CameraControl.js'
import LightingManager from '../Managers/LightingManager.js'
import RendererManager from '../Managers/RendererManager.js'
import PigeonManager from '../Managers/PigeonManager.js'
import RaycastManager from '../Managers/RaycastManager.js'

// Interface components. 
import GuiPanel from './GuiPanel.js'

// Clouds video. 
import gaugan from '../../assets/gaugan.mp4'
import SkyboxManager from '../Managers/SkyboxManager.js'

const styles = {
  container: {
    width: '100vw', 
    height: '100vh',
    overflow: 'hidden'
  },

  crosshair: {
    cursor: 'crosshair'
  },

  video: {
    display: 'none'
  }
};

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state={};

    // Reference to the components that need to be accesed. 
    this.worldRef = React.createRef(); 
    this.guiRef = React.createRef(); 
    this.navRef = React.createRef(); 
    this.panelRef = React.createRef(); 
    this.videoRef = React.createRef();
    
    // 3D scene object where everything is added. 
    this.scene = new THREE.Scene(); 

    // Camera & Interactive controls module. 
    this.cameraControl = new CameraControl(); 

    // Lights.
    this.lightingManager = new LightingManager(this.scene); 

    // Create skybox. 
    this.skyboxManager = new SkyboxManager(this.scene); 

    // Pigeons
    this.pigeonManager = new PigeonManager(); 

    // Raycaster. 
    this.raycastManager = new RaycastManager(this.onShootPigeon.bind(this)); 

    // Three.js Renderer
    this.rendererManager = new RendererManager(); 
  }

  componentDidMount() {
    // Mount the canvas at the current div. 
    let rendererDomElement = this.rendererManager.getDomElement(); 
    this.worldRef.current.appendChild(rendererDomElement); 

    // Get the handle to the FPS graph component. 
    this.fpsGraph = this.guiRef.current.getFpsGraph(); 
    this.guiRef.current.subscribeForPatternChange(this.onPatternChanged.bind(this));

    // Setup texture on the skybox now that the video component is mounted. 
    this.skyboxManager.setupVideoTexture(this.videoRef);

    // This is the initial render. 
    // Initialize the recursive rendering call. 
    this.initializeRender(); 
  }

  // Component render. 
  render() {
    return (
      <div style={styles.container} ref={this.worldRef}>
        <GuiPanel ref={this.guiRef} />
        <video id={'video'} ref={this.videoRef} playsInline loop src={gaugan} style={styles.video} />
      </div>
    );
  }

  // CORE Three.js recursive render loop. 
  initializeRender() {
    this.fpsGraph.begin();
      // Pass the bounding box to the pigeon manager for creating bounds for agents. 
      let boundingBox = this.skyboxManager.getBoundingBox(); 
      this.pigeonManager.update(boundingBox); 

      this.cameraControl.update();
      if (this.pigeonManager.target) {
        this.raycastManager.intersect(this.cameraControl.camera, this.pigeonManager.target.mesh); 
      }

      // This renders each frame. 
      this.rendererManager.render(this.scene, this.cameraControl.getCamera());   
      
      this.skyboxManager.update();   
    this.fpsGraph.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initializeRender.bind(this)); 
  }

  // Instantiate pigeon geometry. 
  beginWorld() {
    this.videoRef.current.play();
    let currentPatternType = this.guiRef.current.getCurPatternType();  
    // Setup the pigeons when world is mounted. 
    this.pigeonManager.setup(this.scene, currentPatternType);
  }

  onPatternChanged(newPatternType) {
    this.pigeonManager.setNewPatternType(newPatternType);
  }

  onShootPigeon() {
    this.pigeonManager.shootPigeon();
  }

  scrollTo() {
    this.worldRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

export default Radium(World);