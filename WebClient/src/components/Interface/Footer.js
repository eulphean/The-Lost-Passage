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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: padding.huge, 
        color: color.darkBlue,
        fontFamily: fontFamily.tenor   
    },

    website: {      
        letterSpacing: 5,
        fontSize: fontSize.lessSmall
    },
  
    message: {
        color: color.orange,
        marginTop: padding.extraSmall,
        letterSpacing: 3,
        fontSize: fontSize.lessSmall,
        fontStyle: 'italic'
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
        <div style={styles.website}>thelostpassage.art, © 2021</div>
        <div style={styles.message}>crafted with love, care, and hope.</div>
      </div>
    );
  }
}

export default Radium(Footer);