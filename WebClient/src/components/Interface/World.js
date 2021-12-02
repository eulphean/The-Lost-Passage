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
import { elementScrollIntoView } from 'seamless-scroll-polyfill'

import AudioManager from '../Managers/AudioManager.js'

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
import front from '../../assets/skybox/Front.mp4'
import SkyboxManager, { IsSkyboxReady } from '../Managers/SkyboxManager.js'

// Set this flag to true when the world has loaded all the videos 
// has created the three.js canvas.
export let IsWorldReady = false; 

// NOTE: Change this when we have more videos loading. 
const NUM_VIDEOS_LOADED = 1; 

const styles = {
  container: {
    width: '100%', 
    height: '100%',
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
    this.scene.background = new THREE.Color('#F9FDFF');

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

    // this.frontVideoRef.current.src = front_url;

    // Setup texture on the skybox now that the video component is mounted. 
    this.skyboxManager.createSkybox(this.scene, this.frontVideoRef);

    // Initialize the recursive rendering call. 
    this.rendererManager.setAnimationLoop(this.renderThree.bind(this)); 

    this.checkIfReady(); 
  }

  // Component render. 
  render() {
    return (
      <div style={styles.container} ref={this.worldRef}>
        <GuiPanel ref={this.guiRef} />
        <video id={'front'} ref={this.frontVideoRef} type='video/mp4' src={front} preload='true' playsInline loop style={styles.video} onCanPlay={this.onVideoLoaded.bind(this) } />
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
        
        // Once the flock is no longer in shock, enable the pigeon params again
        if (!this.pigeonManager.isFlockInShock && this.guiRef.current.getPigeonParamFolder().disabled){
          this.guiRef.current.getPigeonParamFolder().disabled = false;
        }
      }
      
      this.cameraControl.update(this.scene);

      // This renders each frame. 
      this.rendererManager.render(this.scene, this.cameraControl.getCamera());   
      
      this.skyboxManager.update();   

      this.rendererManager.monitorDrawCalls();
      
      // Don't do this.
      // // Wait till the camera animation has stopped before beginning Raycasting. 
      // if (this.cameraControl.animationStopped) {
      //   let mesh = this.skyboxManager.getMesh(); 
      //   // Intersect with bounding box mesh? 
      //   if (mesh) {
      //     this.raycastManager.intersect(this.cameraControl.camera, mesh, this.shouldAnimate); 
      //   }
      // }
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
    this.shouldAnimate = status; 
    if (status) {
      this.rendererManager.setAnimationLoop(this.renderThree.bind(this));
      if (AudioManager.isPermanentlyMute) {
        // Don't retrigger
      } else {
        AudioManager.trigger();
      }
    } else {
      // Pause
      this.pigeonManager.pausePigeons();
      this.rendererManager.setAnimationLoop(null);
      if (AudioManager.isPermanentlyMute) {
        // Don't do anything
      } else {
        AudioManager.release();
      }
    }
  }

  // Instantiate pigeon geometry. 
  beginWorld() {
    // Start playing all the videos.
    this.frontVideoRef.current.play();
    console.log('Playing all videos.');

    // Target setup.
    let currentPatternType = this.guiRef.current.getCurPatternType();  
    this.pigeonManager.setupTarget(currentPatternType);

    // GPUPigeon and GPURenderer
    this.pigeonManager.setupPigeonGPU(this.rendererManager.renderer, this.scene);
  }

  enterWorld() {
    // Animate the camera zooming into the skybox. 
    this.cameraControl.initialTween(this.props.onInitialCameraAnimationDone); 
  }

  onPatternChanged(newPatternType) {
    this.pigeonManager.setNewPatternType(newPatternType);
  }

  onShootPigeon() {
    if (this.shouldAnimate) {
      let isFlockInShock = this.pigeonManager.shootPigeon();
      if (isFlockInShock){
        // If the flock is in shock, disable the pigeon param temporarily
        // to avoid further value adjustment during this process.
        // The gui will be enabled again when the pigeons are no longer in shock
        let pigeonParams = this.guiRef.current.getPigeonParamFolder();
        pigeonParams.disabled = true;
      }
    }     
  }

  scrollTo() {
    elementScrollIntoView(this.worldRef.current, {
      behavior: 'smooth',
      block: 'start'
    });
  }
}

export default Radium(World);
