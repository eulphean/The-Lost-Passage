/*
  Name: ClimateStatement.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Climate Statement component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';
import gaugan from '../../assets/info/pigeon.mp4'

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',

        '@media (min-width: 1200px)': {
          flexDirection: 'row',
          justifyContent: 'center'
        }
    },

    video: {
      width: '100%',

      '@media (min-width: 1200px)': {
        width: '300px',
        objectFit: 'cover'
      }
    },

    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    
    title: {
      textAlign: 'center',
      color: color.darkBlue,
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.veryBig,
      marginTop: padding.big,
      letterSpacing: 1,

      '@media (min-width: 768px)': {
        fontSize: fontSize.extraBig
      },
      
      '@media (min-width: 1024px)': {

      },

      '@media (min-width: 1200px)': {
        fontSize: fontSize.huge
      }
    },

    info: {
      fontFamily: fontFamily.tenor,
      padding: padding.small,
      fontSize: fontSize.lessSmall,
      color: color.darkBlue,

      '@media (min-width: 768px)': {
        fontSize: fontSize.lessSmall
      },
      
      '@media (min-width: 1024px)': {
        fontSize: fontSize.small
      },

      '@media (min-width: 1200px)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1400px)': {
        fontSize: fontSize.big
      }
    }
};

const contentA = "It was a grim awakening in 1914 when the passenger pigeons faced extinction. This displayed the capability of industrial humanity, which annihilated even the most plentiful of natural resources. The Lost Passage reappropriates the past to pose questions about our future - how many extinct species will it take to recalibrate our self-interests? Can we reverse the damage that has been done due to our need for power, control, and authority over other living beings? ";
const contentB = "Perhaps through the lens of this work, the audience may reflect upon our lack of empathy towards other living beings, our guileful ways of harming others for self-interests, and our problematic perception that nature is the implacable enemy that needs to be civilized, contained, and controlled.";
 


class ClimateStatement extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.title}>
            CLIMATE STATEMENT
          </div>
          <div style={styles.info}>
            {contentA}
            <br /><br />
            {contentB}
          </div>
        </div>
        <video style={styles.video} src={gaugan} autoPlay playsInline muted loop/>
      </div>
    );
  }
}

export default Radium(ClimateStatement);