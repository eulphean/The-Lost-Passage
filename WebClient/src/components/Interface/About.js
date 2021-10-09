/*
  Name: About.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the About Us component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

const styles = {
    container: {

    }
};

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div>About Us</div>
    );
  }
}

export default Radium(About);