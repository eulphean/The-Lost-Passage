/*
  Name: Title.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: This components holds the title of the project and the about button
*/

import React from 'react'
import Radium from 'radium'

import { fontFamily, color, fontSize, padding } from '../Utilities/CommonStyles.js'

const animation = {
    floatIn: Radium.keyframes({
      '0%': {
        top: '-100px'
      },
      '50%': {
        top: '-50px',
      },
      '100%': {
        top: '0px',
      }
    }),
  
    floatOut: Radium.keyframes({
      '0%': {
        top: '0'
      },
      '50%': {
        top: '-50px',
      },
      '100%': {
        top: '-100px'
      }
    })
};

const styles = {
    container: {
        position: 'absolute',
        width: '100%',
        top: '-100px'
    },

    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: padding.extraBig,
        alignSelf: 'center',
    },

    animateIn: {
        animation: 'x 2s linear 1 forwards',
        animationName: animation.floatIn
    },

    animateOut: {
        animation: 'x 2s linear 1 forwards',
        animationName: animation.floatOut
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
};

class Title extends React.Component {
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
            <div style={styles.title}>MARTHA.I</div>
            <div style={styles.title}>ABOUT</div>
          </div>
      </div>
    );
  }

  updateTitle() {
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

export default Radium(Title);