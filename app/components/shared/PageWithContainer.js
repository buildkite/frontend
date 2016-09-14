import React from 'react';

class PageWithContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="container">{this.props.children}</div>
    );
  }
}

export default PageWithContainer;
