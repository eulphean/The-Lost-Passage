/*
  Name: GuiPanel.js
  Author: Amay Kataria
  Date: 09/26/2021
  Description: This is the container component where the GUI is placed in the project. It needs to be outside 
  the way of the title. We just move it slightly lower from the top. 
*/

import React from 'react'
import Radium from 'radium'
import ServerGui from '../Utilities/ServerGui';

const styles = {
    container: {
        position: 'absolute',
        top: '120px',
        left: '35px'
    }
};

class GuiPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

    this.guiRef = React.createRef();
  }

  render() {
    return (
      <div ref={this.guiRef} style={styles.container}></div>
    );
  }

  componentDidMount() {
    let containerComponent = this.guiRef.current; 
    this.gui = new ServerGui(containerComponent); 
    this.gui.subscribeShowPanel(this.onShowPanel.bind(this));
    this.gui.subscribeSpawnAgents(this.onSpawnAgents.bind(this));
    this.gui.subscribeShootPigeon(this.onShootPigeon.bind(this));
  }

  getFpsGraph() {
      return this.gui.fpsGraph; 
  }

  onShowPanel() {
    this.props.onShowInfoPanel(); 
  }

  onSpawnAgents() {
    this.props.onSpawnAgents();
  }

  onShootPigeon() {
    this.props.onShootPigeon();
  }

  subscribeForPatternChange(callback) {
    this.gui.subscribeForPatternChange(callback);
  }

  getCurPatternType() {
    return this.gui.currentPatternType; 
  }
}

export default Radium(GuiPanel);