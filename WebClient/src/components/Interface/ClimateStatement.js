/*
  Name: ClimateStatement.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Climate Statement component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';
import gaugan from '../../assets/gaugan.mp4'

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row'  
    },

    
    video: {
      width: '600px',
      height: '100%',
      objectFit: 'fill'
    },

    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    title: {
      letterSpacing: 5,
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.extraHuge,
      marginTop: padding.veryBig,
      color: color.darkBlue
    },

    info: {
      letterSpacing: 3,
      lineSpacing: 2,
      fontFamily: fontFamily.tenor,
      fontSize: fontSize.big,
      color: color.darkBlue,
      padding: padding.veryBig
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
        <div style={styles.videoCanvas}>
          <video style={styles.video} src={gaugan} playsInline loop autoPlay muted />
        </div>
      </div>
    );
  }
}

export default Radium(ClimateStatement);