import React from 'react'
import Radium from 'radium'
// import { padding } from './CommonStyles';
import World from './World.js'

// const styles = {
//   content: {
//     position: 'absolute',
//     top: '0%',
//     zIndex: '1',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginLeft: padding.big, 
//     marginRight: padding.big,
//     overflowX: 'hidden',
//     overflowY: 'auto',

//     '@media (min-width: 768px)': {  
//       marginLeft: padding.veryHuge,
//       marginRight: padding.veryHuge
//     },

//     '@media (min-width: 600px) and (orientation: landscape)': {  
//       marginLeft: padding.massive,
//       marginRight: padding.massive
//     },

//     '@media (min-width: 1024px)': {  
//       marginLeft: padding.veryInsane,
//       marginRight: padding.veryInsane
//     }
//   }
// }

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

  componentDidMount() {
    setTimeout(() => {
      // let totalHeight = this.totalRef.current.scrollHeight; 
      // let totalHeight = 600; 
      // this.worldRef.current.updateRendererHeight(totalHeight);
      // console.log(totalHeight);
    }, 300); 
  }

  componentDidUpdate() {
    console.log(this.totalRef.current.scrollHeight);
  }
}

export default Radium(App);