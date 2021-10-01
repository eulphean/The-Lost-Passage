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

class ContentPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

    this.panelRef = React.createRef();
  }

  render() {
    return (
      <div ref={this.panelRef} style={styles.container}>
        <SectionPanel panelNum={0} />
        <SectionPanel panelNum={1} />
        <SectionPanel panelNum={0} />
        <SectionPanel panelNum={1} />
      </div>
    );
  }

  componentDidMount() {
    console.log('Hello');
  }

  scroll() {
    setTimeout(() => {
      this.panelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50); // Give a little timeout so the panel can be made visible first.
  }
}

export default Radium(ContentPanel);