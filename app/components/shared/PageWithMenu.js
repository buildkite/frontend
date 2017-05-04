import React from 'react';
import PropTypes from 'prop-types';

class PageWithMenu extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const children = React.Children.toArray(this.props.children);

    return (
      <div className="container">
        <div className="clearfix mxn2">
          <div className="md-col md-col-3 px2">
            {children[0]}
          </div>
          <div className="md-col md-col-9 px2">
            {children.slice(1)}
          </div>
        </div>
      </div>
    );
  }
}

export default PageWithMenu;
