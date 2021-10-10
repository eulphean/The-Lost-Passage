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
import { ReactComponent as Pigeon } from '../../assets/pigeon.svg'

const styles = {
    container: {
        position: 'absolute',
        top: '30px',
        left: '30px',
        display: 'flex',
        flexDirection: 'column',
        visibility: 'visible'
    },

    hidden: {
      visibility: 'hidden'
    },

    homeTitle: {
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.huge,
      letterSpacing: 6,
      color: color.darkBlue,
      cursor: 'default'
    },

    titleContainer: {
      display: 'flex',
      flexDirection: 'column'
    },

    title: {
        fontFamily: fontFamily.tenor,
        fontSize: fontSize.small,
        letterSpacing: 2,
        color: color.darkBlue,
        cursor: 'crosshair',
        paddingTop: padding.verySmall
    },

    hover: {
      color: color.brown
    },

    homeButton: {
      position: 'fixed',
      right: padding.big,
      bottom: padding.big,
      fontSize: fontSize.small,
      padding: padding.verySmall,
      backgroundColor: color.lightBlue,
      width: fontSize.gaia,
      height: fontSize.gaia,
      borderRadius: fontSize.extraMassive,
      zIndex: 1
    },

    homeHover: {
      backgroundColor: color.brown
    },

    svg: {
      width: '100%',
      height: '100%',
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
    let containerStyle = styles.container; 
    let pigeonStyle = this.state.isHoveringPigeons ? [styles.title, styles.hover] : styles.title;
    let climateStyle = this.state.isHoveringClimate ? [styles.title, styles.hover] : styles.title;
    let aboutStyle = this.state.isHoveringAbout ? [styles.title, styles.hover] : styles.title; 
    let homeButton = this.getHomeButton(); 
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
        {homeButton}
      </div>
    );
  }

  getHomeButton() {
    let buttonStyle = this.state.showHomeButton ? [styles.homeButton] : [styles.homeButton, styles.hidden];
    buttonStyle = this.state.isHomeButtonHovering ? [buttonStyle, styles.homeHover] : buttonStyle; 
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
    let hovering = this.state.isHomeButtonHovering; 
    this.setState({
      isHomeButtonHovering: !hovering
    }); 
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

    // TODO: Do something about stopping the WebGL loop as well. 
    // Stop rendering or animating the frame. 
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
    }, 500);
  }
}

export default Radium(Navigation);