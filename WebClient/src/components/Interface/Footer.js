/*
  Name: Footer.js
  Author: Amay Kataria
  Date: 10/27/2021
  Description: A simple footer components
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';

const styles = {
    container: {
      marginTop: padding.big, 
      color: color.darkBlue,
      fontFamily: fontFamily.tenor   
    },

    website: {      
      letterSpacing: 2, 
      fontSize: fontSize.lessSmall,
      
      '@media (orientation: landscape)': {
        fontSize: fontSize.lessSmall
      },

      '@media (min-width: 768px)': {
        fontSize: fontSize.verySmall
      },
      
      '@media (min-width: 1024px)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1200px)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1400px)': {
        letterSpacing: 1.0,
        fontSize: fontSize.lessBig
      }
    }
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.website}>thelostpassage.art, ©2021</div>
      </div>
    );
  }
}

export default Radium(Footer);