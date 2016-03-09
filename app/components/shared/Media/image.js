import React from "react";
import classNames from "classnames";

class Image extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    return (
      <div className={classNames(this.props.className)} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default Image;
