import React from "react";

class RowActions extends React.Component {
  static displayName = "Panel.RowActions";

  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    if(children.length > 0) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default RowActions;
