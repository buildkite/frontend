import React from 'react';

class PageWithCenterContent extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    return (
      <div className="container">
        <div className="flex justify-center">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default PageWithCenterContent
