import React from "react";

class Any extends React.Component {
  static displayName = "Permissions.Any";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  static contextTypes = {
    permissions: React.PropTypes.object.isRequired
  };

  render() {
    // Look through all the permissions, and try and find one that's allowed
    let allowed;
    for(let name in this.context.permissions) {
      if(this.context.permissions[name].allowed) {
        allowed = true;
        break;
      }
    }

    if(allowed) {
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

export default Any;
