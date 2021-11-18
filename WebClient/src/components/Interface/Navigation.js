/*
  Name: Navigation.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: This components holds the title of the project and the about button
*/

import React from 'react'
import Radium from 'radium'

import { fontFamily, color, fontSize, padding } from '../Utilities/CommonStyles.js'
import { PanelTitle } from './ContentPanel.js';
import { ReactComponent as Pigeon } from '../../assets/icons/pigeon.svg'
import { ReactComponent as Mute } from '../../assets/icons/mute.svg'
import { ReactComponent as Volume } from '../../assets/icons/volume.svg'
import { isMobile } from 'react-device-detect';
import AudioManager from '../Managers/AudioManager.js';

const animation = {
  color: Radium.keyframes({
    '0%': {
      backgroundColor: color.darkBlue
    },
    '50%': {
      backgroundColor: color.purple,
    },
    '100%': {
      backgroundColor: color.orange,
    }
  })
}

const styles = {
    absoluteContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center',
      visibility: 'visible',     
      zIndex: 1,

      '@media (min-width: 768px) and (orientation: landscape)': {
        alignItems: 'flex-start'
      }
    },

    contentContainer: {
      padding: padding.veryBig
    },

    hidden: {
      visibility: 'hidden'
    },

    homeTitle: {
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.huge,
      letterSpacing: 2,
      color: color.darkBlue,
      cursor: 'default',

      '@media (min-width: 768px) and (orientation: portrait)': {
        fontSize: fontSize.veryHuge,
      },

      '@media (min-width: 1024px)': {
        fontSize: fontSize.extraHuge,
      }
    },

    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      '@media (min-width: 768px) and (orientation: landscape)': {
        alignItems: 'flex-start'
      }
    },

    title: {
        fontFamily: fontFamily.tenor,
        fontSize: fontSize.big,
        letterSpacing: 2,
        color: color.darkBlue,
        cursor: 'crosshair',
        paddingTop: padding.verySmall,
        textShadow: '1px 1px 3px ' + color.darkBlue,

        '@media (min-width: 768px) and (orientation: portrait)': {
          fontSize: fontSize.veryBig
        },

        '@media (min-width: 1024px)': {
          fontSize: fontSize.veryBig
        }
    },

    hover: {
      color: color.orange,
      textShadow: '1px 1px 3px ' + color.orange,
    },

    homeButton: {
      backgroundColor: color.darkBlue,
      padding: padding.verySmall,
      width: fontSize.big,
      height: fontSize.big,
      borderRadius: fontSize.big,
      marginBottom: padding.extraSmall,

      '@media (min-width: 1024px)': {
        padding: padding.verySmall,
        borderRadius: fontSize.extraBig,
        width: fontSize.extraHuge,
        height: fontSize.extraHuge,
      }
    },

    colorFlick: {
      animation: 'x 3s ease-in-out infinite',
      animationName: animation.color,
      animationDirection: 'alternate'
    },

    homeHover: {
      backgroundColor: color.brown
    },

    svg: {
      width: '100%',
      height: '100%',
      fill: 'white'
    },

    muteSvg: {
      width: '90%',
      height: '90%',
      fill: 'white'
    },

    soundButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color.darkBlue,
      padding: padding.verySmall,
      width: fontSize.big,
      height: fontSize.big,
      borderRadius: fontSize.big,
      zIndex: 1,

      '@media (min-width: 1024px)': {
        padding: padding.verySmall,
        borderRadius: fontSize.extraBig,
        width: fontSize.extraHuge,
        height: fontSize.extraHuge,
      }
    },

    buttonCollection: {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      right: padding.verySmall, 
      bottom: padding.veryBig,
      zIndex: 1,

      '@media (min-width: 1024px)': {
        right: padding.small,
      }
    }
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    // On iOS we never are playing sound in the beginning. So we are paused by default. 
    let isPlayingSoundInitialState = isMobile ? false : true; 

    this.state={ 
      isHoveringPigeons: false,
      isHoveringClimate: false,
      isHoveringAbout: false,
      isHomeButtonHovering: false, 
      showHomeButton: false,
      isPlayingSound: isPlayingSoundInitialState
    };
  }

  render() {
    let pigeonStyle = this.state.isHoveringPigeons ? [styles.title, styles.hover] : styles.title;
    let climateStyle = this.state.isHoveringClimate ? [styles.title, styles.hover] : styles.title;
    let aboutStyle = this.state.isHoveringAbout ? [styles.title, styles.hover] : styles.title; 
    let homeButton = this.getHomeButton(); 
    let soundButton = this.getSoundButton();
    return (
      <div style={styles.absoluteContainer}>
        <div style={styles.contentContainer}>
          <div style={styles.homeTitle}>THE LOST PASSAGE</div>
          <div style={styles.titleContainer}>
            <div style={pigeonStyle}
                onClick={this.onClick.bind(this, PanelTitle.PIGEONS)}
                onMouseEnter={this.onHoverPigeons.bind(this)} 
                onMouseLeave={this.onHoverPigeons.bind(this)}>
              ABOUT
            </div>
            <div style={climateStyle} 
              onClick={this.onClick.bind(this, PanelTitle.CLIMATE)}
              onMouseEnter={this.onHoverClimate.bind(this)}
              onMouseLeave={this.onHoverClimate.bind(this)}>
              CLIMATE
            </div>
            <div style={aboutStyle}
                onClick={this.onClick.bind(this, PanelTitle.ABOUT)}
                onMouseEnter={this.onHoverAbout.bind(this)}
                onMouseLeave={this.onHoverAbout.bind(this)}>
              TEAM
            </div>
          </div>
          <div style={styles.buttonCollection}>
            {homeButton}
            {soundButton}
          </div>
        </div>
      </div>
    );
  }

  getSoundButton() {
    let button = this.state.isPlayingSound ? <Volume style={styles.muteSvg} /> : <Mute style={styles.muteSvg} />;
    return (
      <div onClick={this.setSound.bind(this)} style={[styles.soundButton, styles.colorFlick]} >
         {button}
      </div>
    );
  }

  setSound() {
    let isPlaying = this.state.isPlayingSound; 
    if (isPlaying) {
      AudioManager.release();
      AudioManager.isPermanentlyMute = true; // We are muting it permanently, so sound isn't affected from anywhere else. 
    } else {
      // Trigger the sound
      AudioManager.trigger();
    } 

    // Update state
    this.setState({
      isPlayingSound: !this.state.isPlayingSound
    });
  }

  getHomeButton() {
    let buttonStyle = this.state.showHomeButton ? [styles.homeButton, styles.colorFlick] : [styles.homeButton, styles.hidden];
    buttonStyle = this.state.isHomeButtonHovering ? [styles.homeButton, styles.homeHover] : buttonStyle; 
    return (
      <div style={buttonStyle}
          onClick={this.onHomeButtonClick.bind(this)}
          onMouseEnter={this.onHomeButtonHover.bind(this)}
          onMouseLeave={this.onHomeButtonHover.bind(this)}>
        <Pigeon style={styles.svg} />
      </div>
    );
  }

  onHomeButtonHover() {    
    if (isMobile) {
      // Don't update anything
    } else {
      let hovering = this.state.isHomeButtonHovering; 
      this.setState({
        isHomeButtonHovering: !hovering
      }); 
    }    
  }

  onHoverPigeons() {
    if (isMobile) {
      // Don't update anything.
    } else {
      let hovering = this.state.isHoveringPigeons;
      this.setState({
        isHoveringPigeons: !hovering
      }); 
    }
  }

  onHoverClimate() {
    if (isMobile) {
      // Don't update anything
    } else {
      let hovering = this.state.isHoveringClimate;
      this.setState({
        isHoveringClimate: !hovering
      }); 
    }
  }

  onHoverAbout() {
    if (isMobile) {
      // Don't update anything. 
    } else {
      let hovering = this.state.isHoveringAbout;
      this.setState({
        isHoveringAbout: !hovering
      }); 
    }
  }

  onClick(panelTitle) {
    this.props.onClickNavTitle(panelTitle);
    this.setState({
      showHomeButton: true
    });
  }

  onHomeButtonClick() {
    this.props.onClickHomeButton(); 
    setTimeout(() => {
      this.setState({
        showHomeButton: false
      }); 
    }, 250);
  }
}

export default Radium(Navigation);