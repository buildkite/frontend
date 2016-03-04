import React from "react";

const Any = (props, context) => {
  // Look through all the permissions, and try and find one that's allowed
  let allowed;
  for(let name in context.permissions) {
    if(context.permissions[name].allowed) {
      allowed = true;
      break;
    }
  }

  if(allowed) {
    return props.children;
  } else {
    // Since we can't return "null" from a stateless component, returning
    // something that adds not value to the DOM will do for now.
    return (
      <noscript />
    );
  }
}

Any.propTypes = {
  children: React.PropTypes.node.isRequired
};

Any.contextTypes = {
  permissions: React.PropTypes.object.isRequired
};

Any.displayName = "Permissions.Any";

export default Any;
