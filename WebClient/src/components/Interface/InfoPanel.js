/*
  Name: InfoPanel.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: This is the side panel that gets pulled out when something is raycasted or selected in the world. 
*/

import React from 'react'
import Radium from 'radium'

import { fontFamily, color, fontSize, padding } from '../Utilities/CommonStyles.js'

const animation = {
    slideIn: Radium.keyframes({
      '0%': {
        left: '-500px'
      },
      '50%': {
        left: '-250px',
      },
      '100%': {
        left: '0px',
      }
    }),
  
    slideOut: Radium.keyframes({
      '0%': {
        left: '0px'
      },
      '50%': {
        left: '-250px',
      },
      '100%': {
        left: '-500px'
      }
    })
};

const styles = {
    container: {
        position: 'absolute',
        top: '0%',
        width: '500px',
        height: '100%',
        left: '-500px',
        backgroundColor: color.panel
    },

    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: padding.extraBig,
        alignSelf: 'center'
    },

    animateIn: {
        animation: 'x 2s linear 1 forwards',
        animationName: animation.slideIn
    },

    animateOut: {
        animation: 'x 2s linear 1 forwards',
        animationName: animation.slideOut
    },

    title: {
        fontFamily: fontFamily.warsaw,
        fontSize: fontSize.massive,
        letterSpacing: 5,
        opacity: 1,
        color: color.white,
        cursor: 'default'
    },

    about: {
        fontFamily: fontFamily.din,
        color: color.white,
        fontSize: fontSize.massive,
        cursor: 'default'
    }
};

let ANIMATION_STATE = {
    NONE: 0,
    SHOW: 1,
    HIDE: 2
}

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        aniState: ANIMATION_STATE.NONE
    };
  }

  render() {
    let containerStyle = this.state.aniState === ANIMATION_STATE.SHOW ? [styles.container, styles.animateIn] : 
        this.state.aniState === ANIMATION_STATE.HIDE ? [styles.container, styles.animateOut] : styles.container;

    return (
      <div style={containerStyle} >
          <div style={styles.content}>
          </div>
      </div>
    );
  }

  updatePanel() {
      if (this.state.aniState === ANIMATION_STATE.NONE) {
          this.setState({
              aniState: ANIMATION_STATE.SHOW
          });
      } else if (this.state.aniState === ANIMATION_STATE.SHOW) {
          this.setState({
              aniState: ANIMATION_STATE.HIDE
          });
      } else if (this.state.aniState === ANIMATION_STATE.HIDE) {
          this.setState({
              aniState: ANIMATION_STATE.SHOW
          }); 
      }
  }
}

export default Radium(InfoPanel);