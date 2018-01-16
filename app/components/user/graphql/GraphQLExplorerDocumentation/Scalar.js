import React from "react";

class Scalar extends React.PureComponent {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <span className="cm-atom">{this.props.name}</span>
      </span>
    );
  }
}

export default Scalar;
