import React from 'react';
import PropTypes from 'prop-types';

class Menu extends React.Component {
  static displayName = "PageHeader.Menu";

  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div>
        <div className="flex items-center">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Menu;
