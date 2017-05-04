import React from 'react';
import PropTypes from 'prop-types';

class Title extends React.Component {
  static displayName = "PageHeader.Title";

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <h1 className="h1 m0 p0">{this.props.children}</h1>
    );
  }
}

export default Title;
