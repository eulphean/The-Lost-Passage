/*
  Name: ClimateStatement.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Climate Statement component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';
import gaugan from '../../assets/info/gaugan.mp4'

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
        width: '500px',
        objectFit: 'cover'
      }
    },

    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    title: {
      textAlign: 'center',
      color: color.darkBlue,
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.extraBig,
      marginTop: padding.big,
      letterSpacing: 2,
      
      '@media (min-width: 1024px)': {
        letterSpacing: 3,
        fontSize: fontSize.extraHuge,
      }
    },

    info: {
      fontFamily: fontFamily.tenor,
      padding: padding.small,
      fontSize: fontSize.lessSmall,
      color: color.darkBlue,
      letterSpacing: 0.5,
      lineSpacing: 2,

      '@media (min-width: 768px)': {
        fontSize: fontSize.small
      },
      
      '@media (min-width: 1024px)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1200px)': {
        fontSize: fontSize.big
      },

      '@media (min-width: 1400px)': {
        letterSpacing: 1.0,
        fontSize: fontSize.veryBig
      }
    }
};

const content = "The project revisits the past to raise these questions about our future - how many extinct species will it take to recalibrate our self-interests? Can we reverse the damage that has been done due to our need for power, control, and authority over other living beings? This work  is an attempt to reunite the audience with what’s lost in the past; however, only to realize that it’s nearly impossible to do so. In recent times, there have been failed attempts to bring passenger pigeons back to life using the DNA of the last remaining pigeon preserved in a historical museum. Can a clone of this pigeon survive in the world like its predecessors? Does it not seem like a scientific paradox to recreate a lost species, when our existing actions are deteriorating the relationship between us and the species that are presently alive and endangered on this planet? “The Lost Passage” points out that the balance has already been tipped and the damage has already been done. The need of the hour is to collectively reconsider our relationship with other living beings and take urgent steps before authoritatively exhausting the natural resources for our own survival.";
 


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
            {content}
          </div>
        </div>
        <video style={styles.video} src={gaugan} playsInline loop autoPlay muted />
      </div>
    );
  }
}

export default Radium(ClimateStatement);