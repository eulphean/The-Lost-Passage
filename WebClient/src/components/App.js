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
import { elementScrollIntoView } from 'seamless-scroll-polyfill'

import mobilevideo from '../assets/info/mobile_video.mp4'
import { isIOSDevice } from './Managers/Helper.js';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },

  panelStyles: {
    position: 'relative',
    display: 'none'
  },

  panelVisible: {
    display: 'block'
  },

  video: {
    width: '0%',
    height: '0%',
    overflow: 'hidden',
    objectFit: 'cover',
    visibility: 'hidden'
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
    this.enterPanelRef = React.createRef(); 
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
    let content = isMobile ? 
    (
      // <video style={styles.video} ref={this.mobileVideoRef} preload='auto' src={mobilevideo} playsInline muted loop />
      <React.Fragment></React.Fragment>
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
        ref={this.enterPanelRef}
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
      // Don't do anything. 
    } else {
      this.worldRef.current.beginWorld();   
    }
  }

  onLoadComplete() {
    this.setState({
      showEnterPanel: false
    });

    if (isMobile) {
      if (isIOSDevice()) {
        // Don't do anything. Since we can't play audio
        // on iOS until a user directly interacts.
      } else {
        AudioManager.trigger();
      }
      // this.mobileVideoRef.current.play();
      this.onInitialCameraAnimationDone();
    } else {
      // Trigger sound.
       AudioManager.trigger();
      // Begin zoom into the world. 
      this.worldRef.current.enterWorld(); 
    }
  }

  onInitialCameraAnimationDone() {
    this.setState({
      showNavPanel: true
    });
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
      elementScrollIntoView(this.mobileVideoRef.current, {
        behavior: 'smooth',
        block: 'start'
      });
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

  onMobileVideoLoaded() {
    this.enterPanelRef.current.setMobileVideoReady(); 
  }
}

export default Radium(App);