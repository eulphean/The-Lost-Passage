/*
  Name: App.js
  Author: Amay Kataria
  Date: 08/19/2021
  Description: Entry point for the application.
*/

import React from 'react'
import Radium from 'radium'
import World from './World.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };

    this.totalRef = React.createRef(); 
    this.worldRef = React.createRef(); 
  }

  render() {
    return (
      <div>
          <World ref={this.worldRef} />
      </div>
    );
  }

  componentDidUpdate() {
    console.log(this.totalRef.current.scrollHeight);
  }
}

export default Radium(App);

// Some logic to realign the height of the world. 
// setTimeout(() => {
//   // let totalHeight = this.totalRef.current.scrollHeight; 
//   // let totalHeight = 600; 
//   // this.worldRef.current.updateRendererHeight(totalHeight);
//   // console.log(totalHeight);
// }, 300); 