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

const styles = {
    container: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        display: 'flex',
        flexDirection: 'column',
        visibility: 'visible'
    },

    hidden: {
      visibility: 'hidden'
    },

    homeTitle: {
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.extraHuge,
      letterSpacing: 6,
      color: color.darkBlue,
      cursor: 'default'
    },

    titleContainer: {
      marginTop: padding.small,
      display: 'flex',
      flexDirection: 'column'
    },

    title: {
        fontFamily: fontFamily.tenor,
        fontSize: fontSize.big,
        letterSpacing: 3,
        color: color.darkBlue,
        cursor: 'crosshair',
        paddingTop: padding.small
    },

    hover: {
      color: color.brown
    }
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state={ 
      isHidden: true,
      isHoveringPigeons: false,
      isHoveringClimate: false,
      isHoveringAbout: false
    };
  }

  render() {
    let containerStyle = this.state.isHidden ? [styles.container, styles.hidden] : styles.container; 
    let pigeonStyle = this.state.isHoveringPigeons ? [styles.title, styles.hover] : styles.title;
    let climateStyle = this.state.isHoveringClimate ? [styles.title, styles.hover] : styles.title;
    let aboutStyle = this.state.isHoveringAbout ? [styles.title, styles.hover] : styles.title; 
    return (
      <div style={containerStyle} >
            <div style={styles.homeTitle}>THE LOST PASSAGE</div>
            <div style={styles.titleContainer}>
              <div style={pigeonStyle}
                  onClick={this.onClick.bind(this, PanelTitle.PIGEONS)}
                  onMouseEnter={this.onHoverPigeons.bind(this)} 
                  onMouseLeave={this.onHoverPigeons.bind(this)}>
                PASSENGER PIGEONS
              </div>
              <div style={climateStyle} 
                onClick={this.onClick.bind(this, PanelTitle.CLIMATE)}
                onMouseEnter={this.onHoverClimate.bind(this)}
                onMouseLeave={this.onHoverClimate.bind(this)}>
                CLIMATE STATEMENT
              </div>
              <div style={aboutStyle}
                  onClick={this.onClick.bind(this, PanelTitle.ABOUT)}
                  onMouseEnter={this.onHoverAbout.bind(this)}
                  onMouseLeave={this.onHoverAbout.bind(this)}>
                ABOUT US
              </div>
            </div>
      </div>
    );
  }

  onHoverPigeons() {
    let hovering = this.state.isHoveringPigeons;
    this.setState({
      isHoveringPigeons: !hovering
    }); 
  }

  onHoverClimate() {
    let hovering = this.state.isHoveringClimate;
    this.setState({
      isHoveringClimate: !hovering
    }); 
  }

  onHoverAbout() {
    let hovering = this.state.isHoveringAbout;
    this.setState({
      isHoveringAbout: !hovering
    }); 
  }

  onClick(panelTitle) {
    this.props.onClickNavTitle(panelTitle);
  }

  showNav() {
    this.setState({
      isHidden: false
    }); 
  }
}

export default Radium(Navigation);


// animateIn: {
//   animation: 'x 2s linear 1 forwards',
//   animationName: animation.floatIn
// },

// animateOut: {
//   animation: 'x 2s linear 1 forwards',
//   animationName: animation.floatOut
// },


// const animation = {
//   floatIn: Radium.keyframes({
//     '0%': {
//       top: '-100px'
//     },
//     '50%': {
//       top: '-50px',
//     },
//     '100%': {
//       top: '0px',
//     }
//   }),

//   floatOut: Radium.keyframes({
//     '0%': {
//       top: '0'
//     },
//     '50%': {
//       top: '-50px',
//     },
//     '100%': {
//       top: '-100px'
//     }
//   })
// };