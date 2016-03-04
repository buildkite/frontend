import React from "react";

const Only = (props, context) => {
  let result = context.permissions[props.allowed]
  if(!result) {
    throw('Missing permission "' + props.allowed + '"');
  }

  if(result.allowed) {
    return props.children;
  } else {
    // Since we can't return "null" from a stateless component, returning
    // something that adds not value to the DOM will do for now.
    return (
      <noscript />
    );
  }
}

Only.propTypes = {
  children: React.PropTypes.node.isRequired,
  allowed: React.PropTypes.string.isRequired
};

Only.contextTypes = {
  permissions: React.PropTypes.object.isRequired
};

Only.displayName = "Permissions.Only";

export default Only;
