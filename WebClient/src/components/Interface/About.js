/*
  Name: About.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the About Us component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

import Footer from './Footer';
import { color, fontFamily, fontSize, padding } from '../Utilities/CommonStyles';
import beFantastic from '../../assets/sponsors/beFantastic.jpg';
import artahack from '../../assets/sponsors/artahack.jpg';
import supernormal from '../../assets/sponsors/supernormal.jpg';
import dara from '../../assets/sponsors/dara.jpg';
import amay from '../../assets/headshots/amay.jpg';
import shao from '../../assets/headshots/shao.jpg';
import yu from '../../assets/headshots/yu.jpg';
import ong from '../../assets/headshots/ong.jpg';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
        // paddingTop: padding.veryBig,
        // paddingLeft: padding.veryBig,
        // paddingRight: padding.veryBig,
        paddingBottom: padding.small
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

    team: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: padding.small,

      '@media (orientation: landscape)': {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
      },

      '@media (min-width: 768px) and (orientation: portrait)': {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
      }
    },

    member: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: padding.small,
      marginBottom: padding.small,
      // marginLeft: padding.huge,
      // paddingRight: padding.huge,

      '@media (orientation: landscape)': {
        marginLeft: padding.lessBig,
        marginRight: padding.lessBig        
      },

      '@media (min-width: 768px)': {
        marginLeft: padding.lessBig,
        marginRight: padding.lessBig        
      },

      '@media (min-width: 1200px)': {
        marginLeft: padding.veryBig,
        marginRight: padding.veryBig        
      }
    },

    photo: {
      width: '150px',
      height: '150px',
      borderRadius: '75px',
      backgroundColor: color.midGrey,

      '@media (orientation: landscape)': {
        width: '100px',
        height: '100px',
        borderRadius: '75px'
      },

      '@media (min-width: 1200px)': {
        width: '150px',
        height: '150px',
        borderRadius: '100px'
      }
    },

    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fontFamily.tenor,
      marginTop: padding.small
    },

    name: {
      color: color.brown,
      fontSize: fontSize.big,
      textAlign: 'center',
      width: '100%',

      '@media (orientation: landscape)': {
        fontSize: fontSize.lessSmall
      },

      '@media (min-width: 768px)': {
        fontSize: fontSize.small
      },
      
      '@media (min-width: 1024px)': {
        fontSize: fontSize.big
      },

      '@media (min-width: 1200px)': {
        fontSize: fontSize.littleBig
      },

      '@media (min-width: 1400px)': {
        letterSpacing: 1.0,
        fontSize: fontSize.veryBig
      }
    },

    location: {
      color: color.darkBlue,
      fontSize: fontSize.small,
      textAlign: 'center',

      '@media (orientation: landscape)': {
        fontSize: fontSize.verySmall
      },

      '@media (min-width: 768px)': {
        fontSize: fontSize.lessSmall
      },
      
      '@media (min-width: 1024px)': {
        fontSize: fontSize.lessBig
      },

      '@media (min-width: 1200px)': {
        fontSize: fontSize.big
      },

      '@media (min-width: 1400px)': {
        letterSpacing: 1.0,
        fontSize: fontSize.big
      }
    },

    moreMargin: {
      marginTop: padding.veryBig
    },

    sponsors: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: padding.small,

      '@media (orientation: landscape)': {
        flexDirection: 'row',
        justifyContent: 'space-between'
      },

      '@media (min-width: 768px) and (orientation: portrait)': {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
      },
      
      '@media (min-width: 1024px)': {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
      }
    },
    
    image: {
      objectFit: 'contain',
      width: '80%',
      marginTop: padding.small,

      '@media (orientation: landscape)': {
        width: '24%',
      },

      '@media (min-width: 768px) and (orientation: portrait)': {
        width: '24%'
      },

      '@media (min-width: 1024px)': {
        maxWidth:'350px' 
      }
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
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          ABOUT THE TEAM
        </div>   
        <div style={styles.team}>
          {amay}
          {shao}
          {yu}
          {kianPeng}
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
        <Footer />
      </div>
    );
  }

  getKianPeng() {
    return (
      <a href='https://www.ongkianpeng.art/' target='_blank' rel="noreferrer" style={styles.member}>
        <img src={ong} alt='ong' style={styles.photo} />
        <div style={styles.infoContainer}>
          <div style={styles.name}>Ong Kian-Peng</div>
          <div style={styles.location}>Mentor</div>
          <div style={styles.location}>Singapore</div>
        </div>
      </a>
    );
  }

  getAmay() {
    return (
      <a href='https://amaykataria.com' target='_blank' rel="noreferrer"  style={styles.member}>
        <img src={amay} alt='amay' style={styles.photo} />       
        <div style={styles.infoContainer}>
          <div style={styles.name}>Amay Kataria</div>
          <div style={styles.location}>New-Media Artist</div>
          <div style={styles.location}>USA</div>
        </div>
      </a>
    );
  }

  getShao() {
    return (
      <a href='https://www.linkedin.com/in/kshaohui/' target='_blank' rel="noreferrer"  style={styles.member}>
        <img src={shao} alt='shao' style={styles.photo} />
        <div style={styles.infoContainer}>
          <div style={styles.name}>Shaohui Kwok</div>
          <div style={styles.location}>Cultural Producer</div>
          <div style={styles.location}>Singapore</div>
        </div>
      </a>
    );
  }
  
  getYu() {
    return (
      <a href='https://www.linkedin.com/in/yu-jeng-kuo-696133aa/' target='_blank' rel="noreferrer"  style={styles.member}>
        <img src={yu} alt='yu' style={styles.photo} />
        <div style={styles.infoContainer}>
          <div style={styles.name}>Yu-Jeng Kuo</div>
          <div style={styles.location}>Software Engineer</div>
          <div style={styles.location}>Singapore</div>
        </div>
      </a>
    );
  }
}

export default Radium(About);