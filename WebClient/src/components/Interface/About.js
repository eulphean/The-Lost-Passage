/*
  Name: About.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the About Us component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, fontSize, padding } from '../Utilities/CommonStyles';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center'
    },

    title: {
        fontFamily: fontFamily.bebas,
        fontSize: fontSize.gaia,
        marginTop: padding.huge,
        color: color.darkBlue
    }
};

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          ABOUT US
        </div>   
      </div>
    );
  }
}

export default Radium(About);