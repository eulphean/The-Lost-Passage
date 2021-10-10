/*
  Name: About.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the About Us component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import { color, fontFamily, fontSize, padding } from '../Utilities/CommonStyles';
import beFantastic from '../../assets/beFantastic.jpg';
import artahack from '../../assets/artahack.jpg';
import supernormal from '../../assets/supernormal.jpg';
import dara from '../../assets/dara.jpg';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: padding.veryBig,
        paddingLeft: padding.veryBig,
        paddingRight: padding.veryBig,
        paddingBottom: padding.small
    },

    title: {
      letterSpacing: 5,
      fontFamily: fontFamily.bebas,
      fontSize: fontSize.extraHuge,
      marginTop: padding.veryBig,
      color: color.darkBlue
    },

    team: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: padding.huge,
      width: '100%',
      justifyContent: 'center'
    },

    member: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingLeft: padding.huge,
      paddingRight: padding.huge
    },

    photo: {
      width: '100px',
      height: '100px',
      borderRadius: '50px',
      backgroundColor: color.midGrey
    },

    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: fontFamily.tenor,
      marginTop: padding.small
    },

    name: {
      color: color.brown,
      fontSize: fontSize.big
    },

    location: {
      color: color.darkBlue,
      fontSize: fontSize.small
    },

    moreMargin: {
      marginTop: padding.veryHuge
    },

    sponsors: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: padding.big,
      width: '100%'
    },
    
    image: {
      objectFit: 'contain',
      padding: padding.big
    },

    footer: {
      marginTop: padding.huge, 
      letterSpacing: 5,
      fontSize: fontSize.small, 
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
    let kianPeng = this.getKianPeng();
    let amay = this.getAmay();
    let shao = this.getShao();
    let yu = this.getYu(); 
    let footer = this.getFooter(); 
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          ABOUT THE TEAM
        </div>   
        <div style={styles.team}>
          {kianPeng}
          {amay}
          {shao}
          {yu}
        </div>
        <div style={[styles.title, styles.moreMargin]}>
          SUPPORTED BY
        </div> 
        <div style={styles.sponsors}>
          <img style={styles.image} src={beFantastic} alt='befantastic'/>
          <img style={styles.image} src={artahack} alt='artahack' />
          <img style={styles.image} src={supernormal} alt='supernormal' />
          <img style={styles.image} src={dara} alt='dara' />
        </div>
        {footer}
      </div>
    );
  }

  getKianPeng() {
    return (
      <div style={styles.member}>
        <div style={styles.photo}></div>
        <div style={styles.infoContainer}>
          <div style={styles.name}>Ong Kian-Peng</div>
          <div style={styles.location}>Mentor</div>
          <div style={styles.location}>Singapore</div>
        </div>
      </div>
    );
  }

  getAmay() {
    return (
      <div style={styles.member}>
        <div style={styles.photo}></div>
        <div style={styles.infoContainer}>
          <div style={styles.name}>Amay Kataria</div>
          <div style={styles.location}>New Media Artist</div>
          <div style={styles.location}>USA</div>
        </div>
      </div>
    );
  }

  getShao() {
    return (
      <div style={styles.member}>
        <div style={styles.photo}></div>
        <div style={styles.infoContainer}>
          <div style={styles.name}>Shaohui Kwok</div>
          <div style={styles.location}>Cultural Producer</div>
          <div style={styles.location}>Singapore</div>
        </div>
      </div>
    );
  }
  
  getYu() {
    return (
      <div style={styles.member}>
        <div style={styles.photo}></div>
        <div style={styles.infoContainer}>
          <div style={styles.name}>Yu-Jeng Kuo</div>
          <div style={styles.location}>Software Developer</div>
          <div style={styles.location}>Singapore</div>
        </div>
      </div>
    );
  }

  getFooter() {
    return (
      <div style={styles.footer}>thelostpassage.art, © 2021</div>
    )
  }
}

export default Radium(About);