import React from "react";

const Footer = (props) =>
  <div className="border-top py2 px3">
    {props.children}
  </div>

Footer.propTypes = {
  children: React.PropTypes.node.isRequired
};

Footer.displayName = "Panel.Footer";

export default Footer;
