import React from 'react'
import Radium from 'radium'
import World from './World.js'

const styles = {
  content: {
    position: 'absolute',
    top: '0%',
    zIndex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}

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
          <button style={styles.button} onClick={this.export.bind(this)}>EXPORT</button>
      </div>
    );
  }

  export() {
    this.worldRef.current.export(); 
  }
}

export default Radium(App);