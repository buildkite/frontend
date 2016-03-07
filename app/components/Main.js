import React from 'react';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';

class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div>
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default Main;
