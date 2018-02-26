import React from "react";

class Argument extends React.PureComponent {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <span className="cm-attribute">{this.props.name}</span>
      </span>
    );
  }
}

export default Argument;
