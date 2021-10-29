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
import { ReactComponent as Pigeon } from '../../assets/pigeon.svg'
import Footer from './Footer.js'
import { IsGUIReady } from '../Utilities/ServerGui.js'
import { IsPigeonManagerReady } from '../Managers/PigeonManager.js'
import { IsWorldReady } from './World.js'

const FLASH_DURATION = '1.5s';
const TopMessage = "\"They existed in billions, but today they are lost and revered only in museums.\"";
const BottomMessage = "\"May we gather the strength to confront the reality of our climate condition.\"";
const LeftMessage = "\"A cruel and blind human intervention led to the extinction of this species.\"";
const RightMessage = "\"No matter how abundant something is-if one's not careful, one can lose it.\"";

const animation = {
  pulse: Radium.keyframes({
    '0%': {
      transform: 'scale(0.5)'
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(0.5)',
    }
  })
}

const styles = {
    container: {
        position: 'absolute',
        top: '0%',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        background: '#e6e9ec',
        background: '-moz-linear-gradient(top, #e6e9ec 0%, #f9fdff 100%)', /* FF3.6-15 */
        background: '-webkit-linear-gradient(top, #e6e9ec 0%,#f9fdff 100%)', /* Chrome10-25,Safari5.1-6 */
        background: 'linear-gradient(to bottom, #e6e9ec 0%,#f9fdff 100%)' /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    },

    hide: {
        visibility: 'hidden'
    },

    title: {
        fontFamily: fontFamily.bebas,
        fontSize: fontSize.massive,
        textAlign: 'center',
        maxWidth: '200px',
        letterSpacing: 5,
        opacity: 1,
        color: color.darkBlue,

        '@media (min-width: 900px)': {  
          fontSize: fontSize.extraInsane,
          maxWidth: '100%',
          letterSpacing: 6,
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
      fontSize: fontSize.small,
      color: color.darkBlue,
      marginTop: '-' + padding.big
    },

    svg: {
      width: '80%',
      height: '80%',
      fill: color.darkBlue
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
        borderWidth: '4px',
        marginTop: padding.small,
        padding: padding.verySmall,
        letterSpacing: '5px',
        cursor: 'crosshair',

        '@media (min-width: 900px)': {  
          fontSize: fontSize.extraBig,
          paddingTop: padding.small,
          paddingBottom: padding.small,
          paddingLeft: padding.big,
          paddingRight: padding.big,
        }
    },

    hover: {
      backgroundColor: color.midGrey,
      color: color.white
    },

    topMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.lessSmall,
      textAlign: 'center',
      paddingLeft: padding.verySmall,
      paddingRight: padding.verySmall,
      fontFamily: fontFamily.tenor,
      top: '15px',

      '@media (min-width: 900px)': {  
        fontSize: fontSize.lessBig,
        top: '30px',
        paddingTop: padding.small,
        paddingBottom: padding.small,
        paddingLeft: padding.big,
        paddingRight: padding.big,
      }
    },

    leftMessage: {
      position: 'absolute',
      textAlign: 'center',
      maxWidth: '300px',
      left: '-40%',
      color: color.darkBlue, 
      fontSize: fontSize.verySmall,
      fontFamily: fontFamily.tenor,
      transform: 'rotate(-90deg)',

      '@media (min-width: 360px)': {
        left: '-35%'
      },

      
      '@media (min-width: 411px)': {
        left: '-30%'
      },


      '@media (min-width: 900px)': {  
        fontSize: fontSize.lessBig,
        maxWidth: '100%',
        left: '0px',
        paddingTop: padding.small,
        paddingBottom: padding.small,
        paddingLeft: padding.big,
        paddingRight: padding.big,
      }
    },

    rightMessage: {
      position: 'absolute',
      right: '-40%',
      textAlign: 'center',
      maxWidth: '300px',
      fontSize: fontSize.verySmall,
      fontFamily: fontFamily.tenor,
      color: color.darkBlue, 
      transform: 'rotate(90deg)',

      '@media (min-width: 360px)': {
        right: '-35%'
      },

      
      '@media (min-width: 411px)': {
        right: '-30%'
      },

      '@media (min-width: 900px)': {  
        fontSize: fontSize.lessBig,
        right: '0px',
        maxWidth: '100%',
        paddingTop: padding.small,
        paddingBottom: padding.small,
        paddingLeft: padding.big,
        paddingRight: padding.big,
      }
    },

    bottomMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.lessSmall,
      fontFamily: fontFamily.tenor,
      paddingLeft: padding.big,
      paddingRight: padding.big,
      textAlign: 'center',
      bottom: '15px',

      '@media (min-width: 900px)': {  
        fontSize: fontSize.lessBig,
        bottom: '30px',
        paddingTop: padding.small,
        paddingBottom: padding.small,
        paddingLeft: padding.big,
        paddingRight: padding.big,
      }
    }
};

class EnterPanel extends React.Component {
  constructor(props) {
    super(props);
    // Initial render of the component. 
    // NOTE: Whenever a component's state is updated, render is called. 
    this.state={
        isHidden: false,
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
        <Footer />
      </div>
    );
  }

  getLoader() {
    return (
      <div style={styles.loadContainer}>
        <div style={[styles.svgContainer, styles.svgSimplePulse]}>
        <Pigeon style={styles.svg} />
       </div>
       <div style={styles.loadTitle}>
         Getting things ready...
       </div>
      </div>

    );
  }

  getTitle() {
    let buttonStyle = this.state.isHovering ? [styles.button, styles.hover] : [styles.button]; 
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
        </React.Fragment>
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
    setTimeout(() => {
      if (IsGUIReady && IsPigeonManagerReady && IsWorldReady) {
        this.hasFinishedLoading(); 
      } else {
        this.checkIfReady();
      }
    }, 10); 
  }

  hasFinishedLoading() {
    this.setState({
        isHidden: true
    }); 

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