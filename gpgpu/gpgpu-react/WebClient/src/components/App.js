import React from 'react'
import Radium from 'radium'
import World from './World.js'

const styles = {
  content: {
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    };
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