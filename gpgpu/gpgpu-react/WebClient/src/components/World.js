import React from 'react'
import Radium from 'radium'
import * as THREE from 'three'
import oc from 'three-orbit-controls'
import Stats from 'stats.js'

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'


// Shader import
import vertex from '../shaders/test/vertex.glsl'
import fragment from '../shaders/test/fragment.glsl'

import { BIRDS } from './Pigeon'
import PigeonManager from './PigeonManager'

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
    this.scene.background = new THREE.Color(0xffdeff);

    // Camera 
    // (FOV, AspectRatio, Near Clipping, Far Clipping)
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 20000);
    this.camera.position.z = 300; 
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.frustumCulled = false; 

    // Setup orbit controls. 
    this.controls = new OrbitControls(this.camera);
    this.controls.enablePan = true;
    this.controls.enabled = true; 
    this.controls.enableKeys = false;
    this.controls.enableDamping = true; 

    // Renderer 
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    }); 

    // Stats
    this.stats = new Stats(); 
    
    // Setup GUI before pigeon manager is initiated
    // to send it the effectController. 
    this.setupGui();

    // Pigeon manager loads the pigeon. 
    this.pigeonManager = new PigeonManager(this.renderer, this.scene, this.effectController); 

    window.addEventListener('resize', this.onWindowResize.bind(this));
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
    const hemiLight = new THREE.HemisphereLight(0xffdeff, 0xffffff, 1.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0x00CED1, 0.6);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    this.scene.add(dirLight);

    this.initThreeRender(); 
  }

  render() {
    return (
      <div style={styles.container} ref={this.ref} />
    );
  }


  initThreeRender() {
    // Render loop. 
    this.stats.begin();
    this.controls.update();
    this.pigeonManager.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    // Register this function as a callback to every repaint from the browser.
    requestAnimationFrame(this.initThreeRender.bind(this)); 
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setupGui() {
    this.gui = new GUI();
    this.effectController = {
        seperation: 20.0,
        alignment: 20.0,
        cohesion: 20.0,
        freedom: 0.75,
        size: 0.2,
        count: BIRDS
    };
  
    this.gui.add(this.effectController, "seperation", 0.0, 100.0, 1.0).onChange(this.onValuesChange.bind(this));
    this.gui.add(this.effectController, "alignment", 0.0, 100, 0.001).onChange(this.onValuesChange.bind(this));
    this.gui.add(this.effectController, "cohesion", 0.0, 100, 0.025).onChange(this.onValuesChange.bind(this));
    this.gui.add(this.effectController, "size", 0, 1, 0.01).onChange(this.onValuesChange.bind(this));
    this.gui.add(this.effectController, "count", 0, BIRDS, 1).onChange(this.onValuesChange.bind(this));
    this.gui.close();

    // Update uniforms
    this.onValuesChange();
  }

  onValuesChange() {
    if (this.pigeonManager) {
      this.pigeonManager.updateUniforms(this.effectController); 
    }
  }
}

export default Radium(World);


    // // UI Input Binder. 
    // const valuesChanger = function () {
    //   velocityUniforms["separationDistance"].value = effectController.separation;
    //   velocityUniforms["alignmentDistance"].value = effectController.alignment;
    //   velocityUniforms["cohesionDistance"].value = effectController.cohesion;
    //   velocityUniforms["freedomFactor"].value = effectController.freedom;
    //   if ( materialShader ) 
    //       materialShader.uniforms["size"].value = effectController.size;

    //   // Draw range culls the vertices that shouldn't be rendererd. 
    //   BirdGeometry.setDrawRange(0, effectController.count * indicesPerBird); // CRITICAL FIX: Contribute back to Three.js
    // };

    //   // Bind the uniforms or buffer geometry to UI inputs. 
    //   valuesChanger();