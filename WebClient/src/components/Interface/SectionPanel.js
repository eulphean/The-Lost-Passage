/*
  Name: SectionPanel.js
  Author: Amay Kataria
  Date: 09/30/2021
  Description: Each section that contains information about the website. This content is passed in from ContentPanel. 
*/

import React from 'react'
import Radium from 'radium'
import { elementScrollIntoView } from 'seamless-scroll-polyfill'

import { PanelTitle } from './ContentPanel';
import PassengerPigeons from './PassengerPigeons'
import ClimateStatement from './ClimateStatement'
import About from './About'
import { color } from '../Utilities/CommonStyles';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        background: '#e6e9ec',
        background: '-moz-linear-gradient(top, #e6e9ec 0%, #f9fdff 100%)', /* FF3.6-15 */
        background: '-webkit-linear-gradient(top, #e6e9ec 0%,#f9fdff 100%)', /* Chrome10-25,Safari5.1-6 */
        background: 'linear-gradient(to bottom, #e6e9ec 0%,#f9fdff 100%)' /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
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
    let panel = this.getPanel(); 
    return (
      <div style={styles.container} ref={this.containerRef}>
        {panel}
      </div>
    );
  }

  getPanel() {
    if (this.props.title === PanelTitle.PIGEONS) {
      return <PassengerPigeons />
    } else if (this.props.title === PanelTitle.CLIMATE) {
      return <ClimateStatement />
    } else if (this.props.title === PanelTitle.ABOUT) {
      return <About />
    }
  }

  scrollTo() {
    setTimeout(() => {
      elementScrollIntoView(this.containerRef.current, {
        behavior: 'smooth',
        block: 'start'
      });
    }, 50); // Give a little timeout so the panel can be made visible first.
  }
}

export default Radium(SectionPanel);

// this.containerRef.current.scrollIntoView({
//   behavior: 'smooth',
//   block: 'start'
// });