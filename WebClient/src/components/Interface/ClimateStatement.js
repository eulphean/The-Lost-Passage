/*
  Name: ClimateStatement.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Climate Statement component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';

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

class ClimateStatement extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Climate Statement</div>
      </div>
    );
  }
}

export default Radium(ClimateStatement);