import React from 'react';
import PropTypes from 'prop-types';

class Description extends React.Component {
  static displayName = "PageHeader.Description";

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="dark-gray mt1">
        {this.props.children}
      </div>
    );
  }
}

export default Description;
