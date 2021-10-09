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

const FLASH_DURATION = '1.0s';
const Load_Time = 0; // 4 seconds for now. // Change it back once we are ready.
const TopMessage = "\"The avarice and thoughtlessness of humankind led to the extinction of this species.\"";
const BottomMessage = "\"May we gather the strength to confront the reality of our climate condition.\"";
const LeftMessage = "\"Its disappearance is nearly unfathomable. Still can't fully get my mind around it.\"";
const RightMessage = "\"No matter how abundant something is - if we're not careful, we can lose it.\"";


const styles = {
    container: {
        position: 'absolute',
        top: '0%',
        width: '100vw',
        height: '100vh',
        backgroundColor: color.lightBlue,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0
    },

    hide: {
        visibility: 'hidden'
    },

    title: {
        fontFamily: fontFamily.bebas,
        fontSize: fontSize.extraInsane,
        letterSpacing: 6,
        opacity: 1,
        color: color.darkBlue,
    },

    loadContainer: {
        fontSize: fontSize.veryBig
    },

    svg: {
      width: '90%',
      height: '90%',
      fill: color.darkBlue
    },

    flash: {
      animationName: Radium.keyframes(bounceOut, 'bounceOut'),
      animationDuration: FLASH_DURATION,
      animationTimingFunction: 'ease-in-out'
    },

    zoom: {
      animationName: Radium.keyframes(zoomIn, 'zoom'),
      animationDuration: FLASH_DURATION,
      animationTimingFunction: 'ease-in-out',
      animationFillMode: 'forwards'
    },

    button: {
        fontFamily: fontFamily.mont,
        color: color.darkBlue,
        fontSize: fontSize.extraBig,
        borderStyle: 'solid',
        borderWidth: '4px',
        marginTop: padding.small,
        paddingTop: padding.small,
        paddingBottom: padding.small,
        paddingLeft: padding.big,
        paddingRight: padding.big,
        letterSpacing: '5px',
        cursor: 'crosshair'
    },

    hover: {
      backgroundColor: color.midGrey,
      color: color.white
    },

    topMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.lessBig,
      fontFamily: fontFamily.tenor,
      top: '30px'
    },

    leftMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.lessBig,
      fontFamily: fontFamily.tenor,
      left: '15%',
      transform: 'rotate(-90deg)'
    },

    rightMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.lessBig,
      fontFamily: fontFamily.tenor,
      right: '15%',
      transform: 'rotate(90deg)'
    },

    bottomMessage: {
      position: 'absolute',
      color: color.darkBlue, 
      fontSize: fontSize.lessBig,
      fontFamily: fontFamily.tenor,
      bottom: '30px'
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
        isHovering: false
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
    return (
      <div style={[styles.loadContainer, styles.zoom]}>
        <Pigeon style={styles.svg} />
      </div>); 
  }

  getTitle() {
    let buttonStyle = this.state.isHovering ? [styles.button, styles.hover] : [styles.button]; 
    return (
        <React.Fragment>
            <div style={[styles.title, styles.flash]}>THE LOST PASSAGE</div>
            <div 
              onMouseEnter={this.onHover.bind(this)} 
              onMouseLeave={this.onHover.bind(this)} 
              onClick={this.onEnter.bind(this)} 
              style={buttonStyle}>ENTER</div>
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
    this.setState({
        isLoading: true
    });

    // Tell the world that the user has
    // clicked on enter. 
    this.props.onEnterWorld(); 

    // Schedule a cleanup here. 
    setTimeout(this.hasFinishedLoading.bind(this), Load_Time); 
  }

  hasFinishedLoading() {
    this.setState({
        isHidden: true
    }); 

    // Tel the world that load is complete. 
    this.props.onLoadComplete(); 
  }

  onHover() {
    let hoverState = !this.state.isHovering;
    this.setState({
      isHovering: hoverState
    });
  }
}

export default Radium(EnterPanel);