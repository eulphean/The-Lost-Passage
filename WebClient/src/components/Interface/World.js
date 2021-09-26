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

const styles = {
  container: {
    width: '100vw', 
    height: '100vh',
    overflow: 'hidden'
  }
};

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state={};

    // Refs that need to be accessed. 
    this.worldRef = React.createRef(); 
    this.guiRef = React.createRef(); 
    this.titleRef = React.createRef(); 
    this.panelRef = React.createRef(); 
    
    // 3D scene object where everything is added. 
    this.scene = new THREE.Scene(); 

    // Camera & Interactive controls module. 
    this.cameraControl = new CameraControl(); 

    // Lights.
    this.lightingManager = new LightingManager(this.scene); 

    // Pigeons
    this.pigeonManager = new PigeonManager(); 

    // Three.js Renderer
    this.rendererManager = new RendererManager(); 
  }

  componentDidMount() {
    // Mount the canvas at the current div. 
    let rendererDomElement = this.rendererManager.getDomElement(); 
    this.worldRef.current.appendChild(rendererDomElement); 

    // Get the handle to the FPS graph component. 
    this.fpsGraph = this.guiRef.current.getFpsGraph(); 

    // Instantiate terrain geometry.
    this.terrain = new Terrain(this.scene); 

    // Initialize the recursive rendering call. 
    this.initializeRender(); 
  }

  // Component render. 
  render() {
    return (
      <div style={styles.container} ref={this.worldRef}>
        <GuiPanel 
          ref={this.guiRef} 
          onShowInfoPanel={this.onShowInfoPanel.bind(this)}
        />
        <EnterPanel 
          onEnterWorld={this.onEnterWorld.bind(this)} 
          onLoadComplete={this.onLoadComplete.bind(this)}
        />
        <Title ref={this.titleRef} />
        <InfoPanel ref={this.panelRef} />
      </div>
    );
  }

  initializeRender() {
    // Render recursive loop. 
    this.fpsGraph.begin();
      this.pigeonManager.update(); 
      this.cameraControl.update();
      this.rendererManager.render(this.scene, this.cameraControl.getCamera());      
    this.fpsGraph.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initializeRender.bind(this)); 
  }

  onEnterWorld() {
    // Instantiate pigeon geometry. 
    this.pigeonManager.setup(this.scene); 
  }

  onLoadComplete() {
    // Kick off a camera animation to go somewhere 
    // into the agent. 
    // Animate the Title in. 
    this.titleRef.current.updateTitle(); 
  }
  
  onShowInfoPanel() {
    this.panelRef.current.updatePanel(); 
    this.titleRef.current.updateTitle(); 
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