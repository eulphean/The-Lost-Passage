/*
  Name: App.js
  Author: Amay Kataria
  Date: 08/19/2021
  Description: Entry point for the application.
*/

import React from 'react'
import Radium from 'radium'
import World from './Interface/World.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

    this.worldRef = React.createRef(); 
  }

  render() {
    return (
      <div>
        <World ref={this.worldRef} />
      </div>
    );
  }
}

export default Radium(App);