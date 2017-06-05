import React from 'react';
import PropTypes from 'prop-types';

export default class PageWithContainer extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="container">{this.props.children}</div>
    );
  }
}
