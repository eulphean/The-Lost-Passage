/*
  Name: SectionPanel.js
  Author: Amay Kataria
  Date: 09/30/2021
  Description: Each section that contains information about the website. This content is passed in from ContentPanel. 
*/

import React from 'react'
import Radium from 'radium'

const styles = {
    container: {
        position: 'relative',
        width: '100vw',
        height: '1000px'
    },

    colorA: {
        backgroundColor: 'black'
    },

    colorB: {
        backgroundColor: 'green'
    }
};

class SectionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

    this.containerRef = React.createRef(); 
  }

  render() {
    let containerStyles = this.props.panelNum === 0 ? [styles.container, styles.colorA] : [styles.container, styles.colorB]; 
    return (
      <div style={containerStyles} ref={this.containerRef}></div>
    );
  }

  scrollTo() {
    setTimeout(() => {
      this.containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50); // Give a little timeout so the panel can be made visible first.
  }
}

export default Radium(SectionPanel);