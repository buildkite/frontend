import React from "react";

class RowActions extends React.Component {
  static displayName = "Panel.RowActions";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default RowActions;
