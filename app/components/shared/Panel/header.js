import React from "react";

const Header = (props) =>
  <div className="border-bottom border-gray bg-silver py2 px3 semi-bold">
    {props.children}
  </div>

Header.propTypes = {
  children: React.PropTypes.node.isRequired
};

Header.displayName = "Panel.Header";

export default Header;
