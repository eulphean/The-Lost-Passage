/*
  Name: EnterPanel.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: This is the first panel that the user sees. It's the overlay panel when the user comes to the website. 
  It has a transparent finish so one can see the terrain underneath it. It shows the title of the project and the 
  Enter button to enter the website. 
*/

import React from 'react'

import Radium from 'radium'
import { bounceOut, zoomIn } from 'react-animations'
import { fontFamily, color, fontSize, padding } from '../Utilities/CommonStyles.js'
import { ReactComponent as Pigeon } from '../../assets/icons/pigeon.svg'
import { IsPigeonManagerReady } from '../Managers/PigeonManager.js'
import AudioManager from '../Managers/AudioManager.js'
import { IsWorldReady } from './World.js'
import { isMobile } from 'react-device-detect'

const Mobile_Timeout = 3000; // 3.5 seconds

const FLASH_DURATION = '1.5s';
const TopMessage = "\"They existed in billions, but today they are lost and revered only in museums.\"";
const BottomMessage = "\"May we gather the strength to confront the reality of our climate condition.\"";
const LeftMessage = "\"A cruel and blind human intervention led to the extinction of this species.\"";
const RightMessage = "\"No matter how abundant something is-if one's not careful, one can lose it.\"";

const animation = {
  pulse: Radium.keyframes({
    '0%': {
      transform: 'scale(1.0)'
    },
    '50%': {
      transform: 'scale(2.0)',
    },
    '100%': {
      transform: 'scale(1.0)',
    }
  })
}

const styles = {
    container: {
        position: 'fixed',
        top: '0%',
        left: '0%',
        bottom: '0%',
        right: '0%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        // background: '#e6e9ec',
        // background: '-moz-linear-gradient(top, #e6e9ec 0%, #f9fdff 100%)', /* FF3.6-15 */
        // background: '-webkit-linear-gradient(top, #e6e9ec 0%,#f9fdff 100%)', /* Chrome10-25,Safari5.1-6 */
        background: 'linear-gradient(to bottom, #e6e9ec 0%,#f9fdff 100%)' /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    },

    title: {
        fontFamily: fontFamily.bebas,
        fontSize: fontSize.veryHuge,
        textAlign: 'center',
        maxWidth: '200px',
        letterSpacing: 5,
        opacity: 1,
        color: color.darkBlue,
        
        '@media (min-width: 568px)': {
          maxWidth: '100%'
        },

        '@media (min-width: 768px) and (orientation: portrait)': {
          fontSize: fontSize.massive
        },

        '@media (min-width: 1024px) and (orientation: landscape)': {
          fontSize: fontSize.extraInsane,
        },

        '@media (min-width: 1024px) and (orientation: portrait)': {
          fontSize: fontSize.extraInsane,
        }
    },

    loadContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    svgContainer: {
      fontSize: fontSize.veryBig,
    },

    loadTitle: {
      fontFamily: fontFamily.mont,
      fontSize: fontSize.verySmall,
      color: color.darkBlue,
      marginTop: padding.big,

      '@media (min-width: 1024px)': {
        fontSize: fontSize.small
      }
    },

    svg: {
      width: '25px',
      height: '25px',
      fill: color.darkBlue,

      '@media (minWidth: 1024px)': {
        width: '90%',
        height: '90%',
      }
    },

    flash: {
      animationName: Radium.keyframes(bounceOut, 'bounceOut'),
      animationDuration: FLASH_DURATION,
      animationTimingFunction: 'ease-in-out'
    },

    svgSimplePulse: {
      animation: 'x 5s linear infinite',
      animationName: animation.pulse
    },
  
    zoom: {
      animationName: Radium.keyframes(zoomIn, 'zoom'),
      animationDuration: '5.0s', // LOAD TIME...
      animationTimingFunction: 'ease-in-out',
      animationFillMode: 'forwards'
    },

    button: {
        fontFamily: fontFamily.mont,
        color: color.darkBlue,
        fontSize: fontSize.lessBig,
        borderStyle: 'solid',
        borderColor: color.darkBlue,
        borderWidth: '2px',
        marginTop: padding.small,
        padding: padding.verySmall,
        letterSpacing: '2px',
        cursor: 'crosshair',

        '@media (min-width: 1024px)': {
          fontSize: fontSize.extraBig,
          letterSpacing: '4px',
          borderWidth: '4px',
        }
    },

    hover: {
      backgroundColor: color.midGrey,
      color: color.white
    },

    topMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.verySmall,
      textAlign: 'center',
      paddingLeft: padding.verySmall,
      paddingRight: padding.verySmall,
      fontFamily: fontFamily.tenor,
      top: '15px',

      '@media (orientation: landscape)': {
        fontSize: fontSize.verySmall
      },

      '@media (min-width: 768px) and (orientation: landscape)': {
        fontSize: fontSize.verySmall
      },

      '@media (min-width: 568px)': {
        maxWidth: '80%'
      },

      '@media (min-width: 768px) and (orientation: portrait)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1024px) and (orientation: landscape)': {
        fontSize: fontSize.lessBig,
        top: '30px'
      }
    },

    leftMessage: {
      position: 'absolute',
      textAlign: 'center',
      maxWidth: '300px',
      left: '-130px',
      color: color.darkBlue, 
      fontSize: fontSize.verySmall,
      fontFamily: fontFamily.tenor,
      transform: 'rotate(-90deg)',

      '@media (orientation: landscape)': {
        fontSize: fontSize.lessSmall
      },

      '@media (min-width: 768px) and (orientation: portrait)': { 
        maxWidth: '100%',
        fontSize: fontSize.lessBig,
        left: '-250px'
      },

      '@media (min-width: 1024px) and (orientation: landscape)': {
        fontSize: fontSize.small,
        maxWidth: '100%',
        left: '-250px'
      },

      '@media (min-width: 1200px) and (orientation: landscape)': {
        left: '-80px'
      }
    },

    rightMessage: {
      position: 'absolute',
      right: '-130px',
      textAlign: 'center',
      maxWidth: '300px',
      fontSize: fontSize.verySmall,
      fontFamily: fontFamily.tenor,
      color: color.darkBlue, 
      transform: 'rotate(90deg)',

      '@media (orientation: landscape)': {
        fontSize: fontSize.lessSmall
      },

      '@media (min-width: 768px) and (orientation: portrait)': { 
        maxWidth: '100%',
        fontSize: fontSize.lessBig,
        right: '-250px'
      },

      '@media (min-width: 1024px) and (orientation: landscape)': {
        fontSize: fontSize.small,
        maxWidth: '100%',
        right: '-250px'
      },

      '@media (min-width: 1200px) and (orientation: landscape)': {
        right: '-80px'
      }
    },

    bottomMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.verySmall,
      fontFamily: fontFamily.tenor,
      paddingLeft: padding.big,
      paddingRight: padding.big,
      textAlign: 'center',
      bottom: '15px',

      '@media (orientation: landscape)': {
        fontSize: fontSize.verySmall
      },

      '@media (min-width: 568px)': {
        maxWidth: '80%'
      },

      '@media (min-width: 768px) and (orientation: portrait)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1024px) and (orientation: landscape)': {
        fontSize: fontSize.lessBig,
        bottom: '30px'
      }
    },

    headsupContainer: {
      marginTop: padding.lessBig,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '200px',

      '@media (max-width: 800px) and (orientation: landscape)': {
        marginTop: padding.small
      },

      '@media (min-width: 768px) and (orientation: portrait)': {
        maxWidth: '300px'
      },

      '@media (min-width: 1024px) and (orientation: portrait)': {
        maxWidth: '400px'
      },
    },

    hContent: {
      color: color.darkBlue, 
      fontSize: fontSize.lessSmall,
      fontFamily: fontFamily.tenor,
      textAlign: 'center',

      '@media (min-width: 768px) and (orientation: portrait)': {
        fontSize: fontSize.small
      },

      '@media (min-width: 1024px) and (orientation: portrait)': {
        fontSize: fontSize.big
      },
    },

    hContentSmall: {
      fontSize: fontSize.verySmall,

      '@media (min-width: 768px) and (orientation: portrait)': {
        fontSize: fontSize.lessSmall
      },

      '@media (min-width: 1024) and (orientation: portrait)': {
        fontSize: fontSize.lessBig
      },
    }
};

class EnterPanel extends React.Component {
  constructor(props) {
    super(props);
    // Initial render of the component. 
    // NOTE: Whenever a component's state is updated, render is called. 
    this.state={
        isLoading: false,
        isHovering: false,
        isDisabled: true        
    };
  }

  // Overriding React function. 
  render() {
    let containerStyle = styles.container;
    let content = this.state.isLoading ? this.getLoader() : this.getTitle(); 
    let messages = this.getMessages();
    return (
      <div style={containerStyle}>
        {content}
        {messages}
      </div>
    );
  }

  getLoader() {
    let animStyles = [styles.svgContainer, styles.svgSimplePulse];
    return (
      <div style={styles.loadContainer}>
        <div style={animStyles}>
        <Pigeon style={styles.svg} />
       </div>
       <div style={styles.loadTitle}>
         Getting things ready ...
       </div>
      </div>

    );
  }

  getTitle() {
    let buttonStyle = this.state.isHovering ? [styles.button, styles.hover] : [styles.button]; 
    let headsup = !this.state.isDisabled && isMobile ? this.getMobileHeadsup() : <React.Fragment></React.Fragment>;
    let button = this.state.isDisabled ? <React.Fragment></React.Fragment> : (
      <button 
      disabled={this.state.isDisabled}
      onMouseEnter={this.onHoverOn.bind(this)} 
      onMouseLeave={this.onHoverOff.bind(this)} 
      onClick={this.onEnter.bind(this)} 
      style={buttonStyle}>ENTER</button>
    ); 
    return (
        <React.Fragment>
            <div style={[styles.title, styles.flash]}
                onAnimationEnd={this.onStartAnimationEnd.bind(this)}>THE LOST PASSAGE</div>
            {button}  
            {headsup}
        </React.Fragment>
    );
  }

  getMobileHeadsup() {
    return (
      <div style={styles.headsupContainer}>
        <div style={styles.hContent}>Using a mobile device?</div>
        <div style={[styles.hContent, styles.hContentSmall]}>For the full interactive experience, use desktop or laptop.</div>
      </div>
    );
  }
  
  getMessages() {
    return (
      <React.Fragment>
        <div style={styles.topMessage}>{TopMessage}</div>
        <div style={styles.leftMessage}>{LeftMessage}</div>
        <div style={styles.rightMessage}>{RightMessage}</div>
        <div style={styles.bottomMessage}>{BottomMessage}</div>
      </React.Fragment>
    );
  }

  onEnter() {
    // Give a small delay, so this doesn't block the animation thread. 
    setTimeout(() => {
      this.props.onEnterWorld();
    }, 50);

    // Begin animation. 
    this.setState({
        isLoading: true
    });

    // Keep check if I'm ready. 
    this.checkIfReady(); 
  }

  checkIfReady() {
    if (isMobile) {
      setTimeout(() => {
        this.hasFinishedLoading();
      }, Mobile_Timeout); 
    } else {
      this.hasFinishedLoading();
      // setTimeout(() => {
      //   if (IsPigeonManagerReady && IsWorldReady && AudioManager.isAudioManagerReady) {
      //     this.hasFinishedLoading(); 
      //   } else {
      //     this.checkIfReady();
      //   }
      // }, 250); 
    }
  }

  hasFinishedLoading() {
    console.log('Has Finished Loading');
    // Tel the world that load is complete. 
    this.props.onLoadComplete(); 
  }
  
  onHoverOn() {
    if (!this.state.isDisabled) {
      this.setState({
        isHovering: true
      }); 
    }
  }

  onHoverOff() {
    if (!this.state.isDisabled) {
      this.setState({
        isHovering: false
      }); 
    }
  }

  onStartAnimationEnd() {
    // Enable the button now. 
    this.setState({
      isDisabled: false
    }); 
  }
}

export default Radium(EnterPanel);