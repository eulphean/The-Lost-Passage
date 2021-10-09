/*
  Name: App.js
  Author: Amay Kataria
  Date: 08/19/2021
  Description: Entry point for the application.
*/

import React from 'react'
import Radium from 'radium'
import World from './Interface/World.js'
import ContentPanel from './Interface/ContentPanel.js';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  panelStyles: {
    position: 'relative',
    display: 'none'
  },

  panelVisible: {
    display: 'block'
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      showContentPanel: false
    };

    this.worldRef = React.createRef(); 
    this.contentPanelRef = React.createRef();
  }

  render() {
    let panelStyles = this.state.showContentPanel ? [styles.panelStyles, styles.panelVisible] : [styles.panelStyles];
    return (
      <div style={styles.container}>
        <World onScroll={this.onScrollDown.bind(this)} ref={this.worldRef} />
        <div style={panelStyles}>
          <ContentPanel ref={this.contentPanelRef} />
        </div>
      </div>
    );
  }

  onScrollDown(panelTitle) {
    this.setState({
      showContentPanel: true
    });

    // Trigger scroll.
    this.contentPanelRef.current.scroll(panelTitle);
  }
}

export default Radium(App);