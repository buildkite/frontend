import React from "react";

class Only extends React.Component {
  static displayName = "Permissions.Only";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    allowed: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    permissions: React.PropTypes.object.isRequired
  };

  render() {
    let result = this.context.permissions[this.props.allowed]
    if(!result) {
      throw('Missing permission "' + this.props.allowed + '"');
    }

    if(result.allowed) {
      return this.props.children;
    } else {
      // Since we can't return "null" from a stateless component, returning
      // something that adds not value to the DOM will do for now.
      return (
        <noscript />
      );
    }
  }
}

export default Only;
