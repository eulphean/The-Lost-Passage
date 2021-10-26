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
import PigeonManager, { PigeonParams } from '../Managers/PigeonManager.js'
import RaycastManager from '../Managers/RaycastManager.js'

// Interface components. 
import GuiPanel from './GuiPanel.js'

// Clouds video. 
import front from '../../assets/videos/front.mp4'
import back from '../../assets/videos/back.mp4'
import top from '../../assets/videos/top.mp4'
import bottom from '../../assets/videos/bottom.mp4'
import left from '../../assets/videos/left.mp4'
import right from '../../assets/videos/right.mp4'
import SkyboxManager, { IsSkyboxReady } from '../Managers/SkyboxManager.js'

// Set this flag to true when the world has loaded all the videos 
// has created the three.js canvas.
export let IsWorldReady = false; 

// NOTE: Change this when we have more videos loading. 
const NUM_VIDEOS_LOADED = 6; 

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
    this.leftVideoRef = React.createRef();
    this.rightVideoRef = React.createRef();
    this.topVideoRef = React.createRef();
    this.bottomVideoRef = React.createRef();
    
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

    // Pigeons
    this.pigeonManager = new PigeonManager(this.scene); 

    this.videoLoadProgress = []; 

    // Subscribe to events. 
    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('visibilitychange', event => {
      if (document.hidden) {
        this.updateAnimationStatus(false); 
      } else {
        this.updateAnimationStatus(true);
      }
    }); 
  }

  componentDidMount() {
    // Mount the canvas at the current div. 
    let rendererDomElement = this.rendererManager.getDomElement(); 
    this.worldRef.current.appendChild(rendererDomElement); 

    // Get the handle to the FPS graph component. 
    this.fpsGraph = this.guiRef.current.getFpsGraph(); 
    this.guiRef.current.subscribeForPatternChange(this.onPatternChanged.bind(this));

    // Setup texture on the skybox now that the video component is mounted. 
    this.skyboxManager.createSkybox(this.scene, 
        this.frontVideoRef, 
        this.backVideoRef, 
        this.leftVideoRef, 
        this.rightVideoRef, 
        this.topVideoRef, 
        this.bottomVideoRef);

    // Initialize the recursive rendering call. 
    this.rendererManager.setAnimationLoop(this.renderThree.bind(this)); 

    this.checkIfReady(); 
  }

  // Component render. 
  render() {
    return (
      <div style={styles.container} ref={this.worldRef}>
        <GuiPanel ref={this.guiRef} />
        <video id={'front'} ref={this.frontVideoRef} playsInline loop src={front} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
        <video id={'back'} ref={this.backVideoRef} playsInline loop src={back} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
        <video id={'left'} ref={this.leftVideoRef} playsInline loop src={left} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
        <video id={'right'} ref={this.rightVideoRef} playsInline loop src={right} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
        <video id={'top'} ref={this.topVideoRef} playsInline loop src={top} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
        <video id={'bottom'} ref={this.bottomVideoRef} playsInline loop src={bottom} style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
      </div>
    );
  }

  onVideoLoaded() {
    if (this.videoLoadProgress.length < NUM_VIDEOS_LOADED) {
      this.videoLoadProgress.push(true);
      this.checkIfReady(); 
    }
  }

  checkIfReady() {
    // Make sure to change length of the videos here. 
    if (this.videoLoadProgress.length === NUM_VIDEOS_LOADED && IsSkyboxReady) {
      IsWorldReady = true; 
      console.log('World Ready.');
    }
  }

  // CORE Three.js recursive render loop. 
  renderThree() {
    this.fpsGraph.begin();
      // Pass the bounding box to the pigeon manager for creating bounds for agents. 
      if (this.pigeonManager) {
        let boundingBox = this.skyboxManager.getBoundingBox(); 
        this.pigeonManager.update(boundingBox);
      }
      
      this.cameraControl.update();

      // This renders each frame. 
      this.rendererManager.render(this.scene, this.cameraControl.getCamera());   
      
      this.skyboxManager.update();   

      this.rendererManager.monitorDrawCalls();
    this.fpsGraph.end();
  }

  onWindowResize() {
    if (this.cameraControl) {
      let camera = this.cameraControl.getCamera(); 
      camera.aspect = window.innerWidth / window.innerHeight; 
      camera.updateProjectionMatrix(); 
      this.rendererManager.updateSize(window.innerWidth, window.innerHeight);
    }
  }

  updateAnimationStatus(status) {  
    console.log('Animation Status: ' + status);
    this.shouldAnimate = status; 

    if (status) {
      this.rendererManager.setAnimationLoop(this.renderThree.bind(this));
    } else {
      // Pause
      this.pigeonManager.pausePigeons();
      this.rendererManager.setAnimationLoop(null);
    }
  }

  // Instantiate pigeon geometry. 
  beginWorld() {
    // Start playing all the videos.
    this.frontVideoRef.current.play();
    this.backVideoRef.current.play();
    this.leftVideoRef.current.play();
    this.rightVideoRef.current.play();
    this.topVideoRef.current.play();
    this.bottomVideoRef.current.play();
    console.log('Playing all videos.');

    // Target setup.
    let currentPatternType = this.guiRef.current.getCurPatternType();  
    this.pigeonManager.setupTarget(currentPatternType);

    // GPUPigeon and GPURenderer
    this.pigeonManager.setupPigeonGPU(this.rendererManager.renderer, this.scene);
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

      // // Target exists? 
      // if (this.pigeonManager.target) {
      //   this.raycastManager.intersect(this.cameraControl.camera, this.pigeonManager.target.mesh); 
      // }