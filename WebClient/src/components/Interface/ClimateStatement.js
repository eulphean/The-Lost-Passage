/*
  Name: ClimateStatement.js
  Author: Amay Kataria
  Date: 10/09/2021
  Description: This is the Climate Statement component that gets rendered within the Section Panel. 
*/

import React from 'react'
import Radium from 'radium'

const styles = {
    container: {

    }
};

class ClimateStatement extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  render() {
    return (
      <div>Climate Statement</div>
    );
  }
}

export default Radium(ClimateStatement);