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
import Terrain from '../Environment/Terrain.js'
import CameraControl from '../Managers/CameraControl.js'
import LightingManager from '../Managers/LightingManager.js'
import RendererManager from '../Managers/RendererManager.js'
import PigeonManager from '../Managers/PigeonManager.js'

// Interface components. 
import GuiPanel from './GuiPanel.js'
import EnterPanel from './EnterPanel.js'
import Title from './Title.js'
import InfoPanel from './InfoPanel.js'

import landscape from '../../assets/landscape.jpg'
import clouds from '../../assets/gaugan.mp4'
import Panel from './ContentPanel.js'

const styles = {
  container: {
    width: '100vw', 
    height: '100vh',
    overflow: 'hidden'
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
    this.titleRef = React.createRef(); 
    this.panelRef = React.createRef(); 
    this.videoRef = React.createRef();
    
    // 3D scene object where everything is added. 
    this.scene = new THREE.Scene(); 

    // Camera & Interactive controls module. 
    this.cameraControl = new CameraControl(); 

    // Lights.
    this.lightingManager = new LightingManager(this.scene); 

    // Pigeons
    this.pigeonManager = new PigeonManager(); 

    // Instantiate terrain geometry.
    // this.terrain = new Terrain(this.scene); 

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

    // This is the initial render. 
    // Initialize the recursive rendering call. 
    this.initializeRender(); 

    this.addSkybox();
    //this.addSkySphere();
  }

  // Component render. 
  render() {
    return (
      <div style={styles.container} ref={this.worldRef}>
        <GuiPanel 
          ref={this.guiRef} 
          onShowInfoPanel={this.onShowInfoPanel.bind(this)}
          onSpawnAgents={this.onSpawnAgents.bind(this)}
          onShootPigeon={this.onShootPigeon.bind(this)}
        />
        <EnterPanel 
          onEnterWorld={this.onEnterWorld.bind(this)} 
          onLoadComplete={this.onLoadComplete.bind(this)}
        />
        <Title onClickAbout={this.onClickAbout.bind(this)} ref={this.titleRef} />
        <InfoPanel ref={this.panelRef} />
        <video id={'video'} ref={this.videoRef} playsInline loop src={clouds} style={styles.video} />
      </div>
    );
  }

  // CORE Three.js recursive render loop. 
  initializeRender() {
    this.fpsGraph.begin();
      this.pigeonManager.update(); 
      this.cameraControl.update();
      // This renders each frame. 
      this.rendererManager.render(this.scene, this.cameraControl.getCamera());      
    this.fpsGraph.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initializeRender.bind(this)); 
  }

  addSkybox() {
    // const texture = new THREE.TextureLoader().load(landscape);
    const texture = new THREE.VideoTexture(this.videoRef.current);
    // texture.wrapS = THREE.MirroredRepeatWrapping;
    const geometry = new THREE.BoxGeometry(70, 70, 70);
    const material = new THREE.MeshBasicMaterial( {side: THREE.BackSide, map: texture} );
    const cube = new THREE.Mesh( geometry, material );
    this.scene.add(cube);
  }

  addSkySphere() {
    //const texture = new THREE.TextureLoader().load(landscape);   ;
    const texture = new THREE.VideoTexture(this.videoRef.current);
    const geometry = new THREE.SphereGeometry(100, 100, 100); 
    const material = new THREE.MeshBasicMaterial( {side: THREE.BackSide, map: texture});
    const sphere = new THREE.Mesh (geometry, material);

    this.scene.add(sphere);
  }

  onEnterWorld() {
    // Instantiate pigeon geometry. 
    this.videoRef.current.play();
    let currentPatternType = this.guiRef.current.getCurPatternType(); 
    this.pigeonManager.setup(this.scene, currentPatternType); 
  }

  onLoadComplete() {
    // Kick off a camera animation to go somewhere into the agent. 
    // Animate the Title-In. 
    this.titleRef.current.updateTitle(); 
  }
  
  onShowInfoPanel() {
    this.panelRef.current.updatePanel(); 
    this.titleRef.current.updateTitle(); 
  }

  onPatternChanged(newPatternType) {
    this.pigeonManager.setNewPatternType(newPatternType);
  }

  onSpawnAgents() {
    this.pigeonManager.spawnPigeons(this.scene);
  }

  onShootPigeon() {
    this.pigeonManager.shootPigeon();
  }

  onClickAbout() {
    this.props.onScroll(); 
  }
}

export default Radium(World);


// const Raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2(); 

// onMouseMove(event) {
//   //mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//   //mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//   // console.log(mouse.x + ', ' + mouse.y);
// }

// onClick(event) {
//   // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//   // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//   // Raycaster.setFromCamera(mouse, this.camera);

//   // // calculate objects intersecting the picking ray
//   // const intersects = Raycaster.intersectObject(this.terrain.getMesh(), true);
//   // for (let i = 0; i < intersects.length; i ++) {
//   //   //intersects[ i ].object.material.color.set( 0xff0000 );
//   // }
//   // console.log('Mouse Clicked');

//   let a = this.gui.getSaveObject();
//   console.log(a);
// }
// window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
// //window.addEventListener('click', this.onClick.bind(this), true)