import React from 'react';
import PropTypes from 'prop-types';

class PageWithContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="container">{this.props.children}</div>
    );
  }
}

export default PageWithContainer;
