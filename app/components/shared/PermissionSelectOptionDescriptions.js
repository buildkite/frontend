import React from 'react';
import PropTypes from 'prop-types';

export default class PermissionSelectOptionDescriptions extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="pointer-events-none" style={{ marginTop: 8, marginLeft: -4 }}>
        {this.props.children}
      </div>
    );
  }
}
