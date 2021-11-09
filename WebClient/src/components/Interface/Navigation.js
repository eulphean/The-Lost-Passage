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
import { isMobile } from 'react-device-detect';

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
      fontSize: fontSize.extraBig,
      letterSpacing: 2,
      color: color.darkBlue,
      cursor: 'default',

      '@media (min-width: 768px) and (orientation: portrait)': {
        fontSize: fontSize.huge,
        letterSpacing: 6
      },

      '@media (min-width: 1024px)': {
        fontSize: fontSize.veryHuge,
        letterSpacing: 6
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
        fontSize: fontSize.verySmall,
        letterSpacing: 2,
        color: color.darkBlue,
        cursor: 'crosshair',
        paddingTop: padding.verySmall,

        '@media (min-width: 768px) and (orientation: portrait)': {
          fontSize: fontSize.small
        },

        '@media (min-width: 1024px)': {
          fontSize: fontSize.big
        }
    },

    hover: {
      color: color.brown
    },

    homeButton: {
      position: 'fixed',
      right: padding.big,
      bottom: padding.big,
      backgroundColor: color.darkBlue,
      borderRadius: fontSize.huge,
      padding: padding.small,
      width: fontSize.extraHuge,
      height: fontSize.extraHuge,
      zIndex: 1,

      '@media (min-width: 1024px)': {
        padding: padding.verySmall,
        borderRadius: fontSize.extraMassive,
        width: fontSize.gaia,
        height: fontSize.gaia,
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
    }
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state={ 
      isHoveringPigeons: false,
      isHoveringClimate: false,
      isHoveringAbout: false,
      isHomeButtonHovering: false, 
      showHomeButton: false
    };
  }

  render() {
    let pigeonStyle = this.state.isHoveringPigeons ? [styles.title, styles.hover] : styles.title;
    let climateStyle = this.state.isHoveringClimate ? [styles.title, styles.hover] : styles.title;
    let aboutStyle = this.state.isHoveringAbout ? [styles.title, styles.hover] : styles.title; 
    let homeButton = this.getHomeButton(); 
    return (
      <div style={styles.absoluteContainer}>
        <div style={styles.contentContainer}>
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
          {homeButton}
        </div>
      </div>
    );
  }

  getHomeButton() {
    console.log('Home Button: ' + this.state.showHomeButton);
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