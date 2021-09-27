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

import { fontFamily, color, fontSize, padding } from '../Utilities/CommonStyles.js'

const styles = {
    container: {
        position: 'absolute',
        top: '0%',
        width: '100vw',
        height: '100vh',
        backgroundColor: color.darkWithAlpha,
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
        fontFamily: fontFamily.warsaw,
        fontSize: fontSize.extraMassive,
        letterSpacing: 5,
        opacity: 1,
        color: color.white,
    },

    loading: {
        fontFamily: fontFamily.din,
        fontSize: fontSize.veryBig, 
        color: color.white
    },

    button: {
        fontFamily: fontFamily.din,
        color: color.white,
        fontSize: fontSize.veryBig,
        borderStyle: 'solid',
        borderWidth: '2px',
        padding: padding.verySmall,
        paddingLeft: padding.veryBig,
        paddingRight: padding.veryBig,
        cursor: 'default'
    }
};

const Load_Time = 0; // 3 seconds for now. // Change it back once we are ready.

class EnterPanel extends React.Component {
  constructor(props) {
    super(props);
    // Initial render of the component. 
    // NOTE: Whenever a component's state is updated, render is called. 
    this.state={
        isHidden: false,
        isLoading: false
    };
  }

  // Overriding React function. 
  render() {
    let containerStyle = this.state.isHidden ? [styles.container, styles.hide] : styles.container;
    let content = this.state.isLoading ? this.getLoader() : this.getTitle(); 
    return (
      <div style={containerStyle}>
          {content}
      </div>
    );
  }

  getLoader() {
    return (<div style={styles.loading}>Loading ...</div>); 
  }

  getTitle() {
    return (
        <React.Fragment>
            <div style={styles.title}>MARTHA.I</div>
            <div onClick={this.onEnter.bind(this)} style={styles.button}>ENTER</div>
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
}

export default Radium(EnterPanel);