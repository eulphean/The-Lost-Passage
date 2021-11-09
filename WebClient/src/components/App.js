/*
  Name: App.js
  Author: Amay Kataria
  Date: 08/19/2021
  Description: Entry point for the application.
*/

import React from 'react'
import Radium from 'radium'

import World from './Interface/World.js'
import ContentPanel from './Interface/ContentPanel.js';
import Navigation from './Interface/Navigation.js'
import EnterPanel from './Interface/EnterPanel.js';
import AudioManager from './Managers/AudioManager.js';
import { isMobile } from 'react-device-detect'

import gaugan from '../assets/info/gaugan.mp4'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  panelStyles: {
    position: 'relative',
    display: 'none'
  },

  panelVisible: {
    display: 'block'
  },

  video: {
    width: '100vw',
    height: '100vh',
    objectFit: 'cover'
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      showContentPanel: false,
      showNavPanel: false,
      showEnterPanel: true
    };

    this.worldRef = React.createRef(); 
    this.contentPanelRef = React.createRef();
    this.navRef = React.createRef();
    this.mobileVideoRef = React.createRef();
  }

  render() {
    let navPanel = this.state.showNavPanel ? this.getNavPanel() : <React.Fragment></React.Fragment>;
    let enterPanel = this.state.showEnterPanel ? this.getEnterPanel() : <React.Fragment></React.Fragment>;
    let contentPanel = this.getContentPanel();
    let worldContent = this.getWorldContent();
    return (
      <div style={styles.container}>
        {worldContent}
        {navPanel}
        {enterPanel}
        {contentPanel}
      </div>
    );
  }

  getWorldContent() {
    console.log('Mobiel: ' + isMobile);
    let content = isMobile ? 
    (
      <video id={'front'} ref={this.mobileVideoRef} type='video/mp4' src={gaugan} preload='true' playsInline loop style={styles.video} />
    ) :
    (
      <World ref={this.worldRef} onInitialCameraAnimationDone={this.onInitialCameraAnimationDone.bind(this)} />
    ); 

    return content; 
  }

  getNavPanel() {
    return (
      <Navigation ref={this.navRef} 
        onClickNavTitle={this.onClickNavTitle.bind(this)} 
        onClickHomeButton={this.onClickHomeButton.bind(this)}/>
    );
  }

  getEnterPanel() {
    return (
      <EnterPanel 
        onEnterWorld={this.onEnterWorld.bind(this)} 
        onLoadComplete={this.onLoadComplete.bind(this)}
      />
    );
  }

  getContentPanel() {
    let contentPanelStyles = this.state.showContentPanel ? [styles.panelStyles, styles.panelVisible] : [styles.panelStyles];
    return (
      <div style={contentPanelStyles}>
        <ContentPanel ref={this.contentPanelRef} />
      </div>
    );
  }

  onEnterWorld() {
    if (isMobile) {

    } else {
      this.worldRef.current.beginWorld();   
    }
  }

  onLoadComplete() {
    this.setState({
      showEnterPanel: false
    });

    if (isMobile) {
      this.mobileVideoRef.current.play();
      this.onInitialCameraAnimationDone();
    } else {
      // Begin zoom into the world. 
      this.worldRef.current.enterWorld(); 
    }
  }

  onInitialCameraAnimationDone() {
    this.setState({
      showNavPanel: true
    }); 

    // Trigger sound.
    AudioManager.trigger();
  }
    
  onClickNavTitle(panelTitle) {
    // Show the content panel now. 
    this.setState({
      showContentPanel: true
    });

    // Trigger scroll.
    this.contentPanelRef.current.scroll(panelTitle);

    if (isMobile) {
      // Pause the video
    } else {
      // Stop Renderer
      this.worldRef.current.updateAnimationStatus(false); 
    }
  }

  onClickHomeButton() {
    if (isMobile) {
      // Scroll back up to the video. 
    } else {
      this.worldRef.current.scrollTo(); 
      this.worldRef.current.updateAnimationStatus(true);
    }

    setTimeout(() => {
      this.setState({
        showContentPanel: false
      });
    }, 1000); // Give a little timeout so the panel can be made visible first.
  }
}

export default Radium(App);