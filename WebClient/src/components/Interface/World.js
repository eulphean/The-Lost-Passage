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
import front from '../../assets/front.mp4'
import back from '../../assets/back.mp4'
import SkyboxManager, { IsSkyboxReady } from '../Managers/SkyboxManager.js'

// Set this flag to true when the world has loaded all the videos 
// has created the three.js canvas.
export let IsWorldReady = false; 

// NOTE: Change this when we have more videos loading. 
const NUM_VIDEOS_LOADED = 2; 

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

    // Animation flag. 
    this.shouldAnimate = true; 

    // Reference to the components that need to be accesed. 
    this.worldRef = React.createRef(); 
    this.guiRef = React.createRef(); 
    this.navRef = React.createRef(); 
    this.panelRef = React.createRef(); 

    // Video ref. 
    this.frontVideoRef = React.createRef();
    this.backVideoRef = React.createRef(); 
    
    // 3D scene object where everything is added. 
    this.scene = new THREE.Scene(); 
    this.scene.background = new THREE.Color(0xffdeff);

    // Camera & Interactive controls module. 
    this.cameraControl = new CameraControl(); 

    // Lights.
    this.lightingManager = new LightingManager(this.scene); 

    // Simple instance. Nothing happens here. 
    this.skyboxManager = new SkyboxManager(); 

    // Raycaster. 
    this.raycastManager = new RaycastManager(this.onShootPigeon.bind(this)); 

    // Three.js Renderer
    this.rendererManager = new RendererManager(); 

    // // Pigeons
    this.pigeonManager = new PigeonManager(this.scene); 

    this.videoLoadProgress = []; 

    // Resizer
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  componentDidMount() {
    // Mount the canvas at the current div. 
    let rendererDomElement = this.rendererManager.getDomElement(); 
    this.worldRef.current.appendChild(rendererDomElement); 

    // Get the handle to the FPS graph component. 
    this.fpsGraph = this.guiRef.current.getFpsGraph(); 
    this.guiRef.current.subscribeForPatternChange(this.onPatternChanged.bind(this));

    // Setup texture on the skybox now that the video component is mounted. 
    this.skyboxManager.createSkybox(this.scene, this.frontVideoRef, this.backVideoRef);

    // Initialize the recursive rendering call. 
    this.initializeRender(); 

    this.checkIfReady(); 
  }

  // Component render. 
  render() {
    return (
      <div style={styles.container} ref={this.worldRef}>
        <GuiPanel ref={this.guiRef} />
        <video id={'front'} ref={this.frontVideoRef} playsInline loop src={front} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
        <video id={'back'} ref={this.backVideoRef} playsInline loop src={back} style={styles.video} />
      </div>
    );
  }

  onVideoLoaded() {
    this.videoLoadProgress.push(true);
    this.checkIfReady(); 
  }

  checkIfReady() {
    // Make sure to change length of the videos here. 
    if (this.videoLoadProgress.length === NUM_VIDEOS_LOADED && IsSkyboxReady) {
      IsWorldReady = true; 
      console.log('World Ready');
    }
  }

  // CORE Three.js recursive render loop. 
  initializeRender() {
    this.fpsGraph.begin();
      // Pass the bounding box to the pigeon manager for creating bounds for agents. 
      //let boundingBox = this.skyboxManager.getBoundingBox(); 
      //this.pigeonManager.update(boundingBox); 
      if (this.pigeonManager) {
        this.pigeonManager.update();
      }
      
      this.cameraControl.update();

      // Target exists? 
      if (this.pigeonManager.target) {
        this.raycastManager.intersect(this.cameraControl.camera, this.pigeonManager.target.mesh); 
      }

      // This renders each frame. 
      this.rendererManager.render(this.scene, this.cameraControl.getCamera());   
      
      this.skyboxManager.update();   

      this.rendererManager.monitorDrawCalls();
    this.fpsGraph.end();

    if (true) {
      // Register this function as a callback to every repaint from the browser.
      requestAnimationFrame(this.initializeRender.bind(this)); 
    }
  }

  onWindowResize() {
    if (this.cameraControl) {
      let camera = this.cameraControl.getCamera(); 
      camera.aspect = window.innerWidth / window.innerHeight; 
      camera.updateProjectionMatrix(); 
      this.rendererManager.updateSize(window.innerWidth, window.innerHeight);
    }
  }

  updateAnimation(status) {
    this.shouldAnimate = status; 
    
    // Start animating again in this state. 
    if (status) {
      this.initializeRender();
    }
  }

  // Instantiate pigeon geometry. 
  beginWorld() {
    let currentPatternType = this.guiRef.current.getCurPatternType();  
    this.pigeonManager.setupTarget(currentPatternType);

    this.pigeonManager.setupPigeonGPU(this.rendererManager.renderer, this.scene);

    // Start playing all the videos.
    this.frontVideoRef.current.play();
    this.backVideoRef.current.play();
  }

  onPatternChanged(newPatternType) {
    this.pigeonManager.setNewPatternType(newPatternType);
  }

  onShootPigeon() {
    //this.pigeonManager.shootPigeon();
  }

  scrollTo() {
    this.worldRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    }, 100);
  }
}

export default Radium(World);