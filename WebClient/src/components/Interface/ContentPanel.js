/*
  Name: ContentPanel.js
  Author: Amay Kataria
  Date: 09/30/2021
  Description: Collection of information panels that contain information about the website. 
*/

import React from 'react'
import Radium from 'radium'

import SectionPanel from './SectionPanel';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
};

export const PanelTitle = {
  PIGEONS: 'PASSENGER PIGEONS',
  CLIMATE: 'CLIMATE STATEMENT',
  ABOUT: 'ABOUT US'
}

class ContentPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

    this.pigeonPanelRef = React.createRef();
    this.climatePanelRef = React.createRef();
    this.aboutPanelRef = React.createRef(); 
  }

  render() {
    return (
      <div style={styles.container}>
        <SectionPanel ref={this.pigeonPanelRef} title={PanelTitle.PIGEONS} panelNum={0} />
        <SectionPanel ref={this.climatePanelRef} title={PanelTitle.CLIMATE} panelNum={1} />
        <SectionPanel ref={this.aboutPanelRef} title={PanelTitle.ABOUT} panelNum={0} />
      </div>
    );
  }

  scroll(panelTitle) {
    if (panelTitle === PanelTitle.PIGEONS) {
      this.pigeonPanelRef.current.scrollTo();
    } else if (panelTitle === PanelTitle.CLIMATE) {
      this.climatePanelRef.current.scrollTo();
    } else if (panelTitle === PanelTitle.ABOUT) {
      this.aboutPanelRef.current.scrollTo(); 
    }
  }
}

export default Radium(ContentPanel);