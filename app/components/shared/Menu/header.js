import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.PureComponent {
  static displayName = "Menu.Header";

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="border border-gray bg-silver py2 px3 semi-bold rounded-top line-height-4">
        {this.props.children}
      </div>
    );
  }
}
