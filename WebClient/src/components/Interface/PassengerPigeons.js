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

      '@media (min-width: 1200px)': {
        flexDirection: 'row',
        justifyContent: 'center'
      }
    },

    ppVideo: {
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

const contentA = "The Lost Passage is a digitally reconstructed environment of a swarm of artificial passenger pigeons, which went extinct in the early 20th century. They once grew to a population of over 5 billion in the 1800s before going into extinction within four decades due to human intervention. The last known flock of these pigeons was raised in careful captivity and migrated through a freight train within North America every year.";
const contentB = "In their new digital home on the internet, they inhabit a never-ending, sublime, yet destitute memory of a lost landscape. However, paradoxically they are confined within the four walls of this space. By using artificial intelligence and machine learning, The Lost Passage reflects upon the historical moment of passenger pigeon’s holocene extinction and resurrects a memory of this lost species.";

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
            THE LOST PASSAGE
          </div>
          <div style={styles.info}>
            {contentA}
            <br /><br />
            {contentB}
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(PassengerPigeons);