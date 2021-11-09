/*
  Name: PassengerPigeons.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Passenger Pigeons component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';
import pp from '../../assets/info/pigeon.mp4'

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',

      '@media (min-width: 1024px)': {
        flexDirection: 'row'
      }
    },

    ppVideo: {
      width: '100%',

      '@media (min-width: 1024px)': {
        width: '600px',
        height: '100%',
        objectFit: 'fill'
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
      
      '@media (min-width: 1024px)': {
        marginTop: padding.veryBig,
        letterSpacing: 5,
        fontSize: fontSize.extraHuge,
      }
    },

    info: {
      fontFamily: fontFamily.tenor,
      padding: padding.small,
      fontSize: fontSize.small,
      color: color.darkBlue,
      letterSpacing: 2,
      lineSpacing: 2,

      '@media (min-width: 1024px)': {
        fontSize: fontSize.big,
        padding: padding.veryBig,
      }
    }
};

const content = "It was a grim awakening in 1914 when the passenger pigeons faced extinction - this displayed the capability of industrial humanity which annihilated even the most plentiful of natural resources. As a sociable flock, they once grew to a population of over 5 billion in the 1800s before going into extinction within four decades due to human intervention. This project is a digitally reconstructed environment of a swarm of artificial passenger pigeons. In this digital space, they inhabit a never-ending, sublime, yet destitute memory of a lost landscape. However, on closer inspection they are actually confined within the four walls of this space. The works reflects upon this historical moment of holocene extinction by utilizing artificial intelligence and machine learning to resurrect a memory of a lost passage, thus evoking a sense of being trapped and confined through the sublime imagery. The audience can coexist in an environment with the ghost of a species they once eliminated -  an ironic and strange affair. Perhaps these occurrences can compel the audience to reflect upon our lack of empathy towards other living beings, our guileful ways of harming others for self-interests, and our problematic perception that nature is the implacable enemy that needs to be civilized, contained, and controlled."
class PassengerPigeons extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <video style={styles.ppVideo} autoPlay playsInline muted loop src={pp} />
        <div style={styles.content}>
          <div style={styles.title}>
            PASSENGER PIGEONS
          </div>
          <div style={styles.info}>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(PassengerPigeons);