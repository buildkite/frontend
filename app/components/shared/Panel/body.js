import React from "react";

const Body = (props) =>
  <div className="py3 px3">
    {props.children}
  </div>

Body.propTypes = {
  children: React.PropTypes.node.isRequired
};

Body.displayName = "Panel.Body";

export default Body;
