import React from "react";

class Body extends React.Component {
  static displayName = "Panel.Body";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="m3">
        {this.props.children}
      </div>
    );
  }
}

export default Body;
