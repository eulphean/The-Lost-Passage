/*
  Name: PassengerPigeons.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Passenger Pigeons component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, padding, fontSize } from '../Utilities/CommonStyles';
import pp from '../../assets/pigeon.mp4'

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row'    
    },

    ppVideo: {
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

const content = "It is obvious, that the organization of the treatment results in a complete compliance with The Facility of Environmental Flexibility (Hubert Agee in The Book of the Emergency Planning) It's a well-known fact that the major accomplishments, such as the continuing setting doctrine, the flexible production planning, the ability bias or the predictable behavior may share attitudes on the major outcomes. The situation is quite a successful matter. To be honest, the continuing hierarchy doctrine and growth opportunities of it are quite high.It's a well-known fact that the major accomplishments, such as the continuing setting doctrine, the flexible production planning, the ability bias or the predictable behavior may share attitudes on the major outcomes.It a well-known fact that the major accomplishments, such as the...."
class PassengerPigeons extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.image}>
          <video style={styles.ppVideo} autoPlay playsInline muted loop src={pp} />
        </div>
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