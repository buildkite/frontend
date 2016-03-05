import React from "react";

const Header = (props) =>
  <div className="border border-gray bg-silver py2 px3 semi-bold rounded-top">
    {props.children}
  </div>

Header.propTypes = {
  children: React.PropTypes.node.isRequired
};

Header.displayName = "Menu.Header";

export default Header;
