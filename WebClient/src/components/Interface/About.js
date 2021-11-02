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
import beFantastic from '../../assets/beFantastic.jpg';
import artahack from '../../assets/artahack.jpg';
import supernormal from '../../assets/supernormal.jpg';
import dara from '../../assets/dara.jpg';
import amay from '../../assets/headshots/amay.jpg';
import shao from '../../assets/headshots/shao.jpg';
import yu from '../../assets/headshots/yu.jpg';
import ong from '../../assets/headshots/ong2.jpg';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
        paddingTop: padding.veryBig,
        // paddingLeft: padding.veryBig,
        // paddingRight: padding.veryBig,
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
      width: '150px',
      height: '150px',
      borderRadius: '75px',
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
      justifyContent: 'space-evenly',
      marginTop: padding.huge,
      width: '100%'
    },
    
    image: {
      objectFit: 'contain'
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
          {kianPeng}
          {amay}
          {shao}
          {yu}
        </div>
        <div style={styles.sponsors}>
          <img width='350px' style={styles.image} src={beFantastic} alt='befantastic'/>
          <img width='300px' style={styles.image} src={artahack} alt='artahack' />
          <img width='300px' style={styles.image} src={supernormal} alt='supernormal' />
          <img width='300px' style={styles.image} src={dara} alt='dara' />
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