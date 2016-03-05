import React from "react";

import Header from "./header";
import IntroWithButton from "./intro-with-button";
import RowLink from "./row-link";
import Body from "./body";
import Footer from "./footer";

const Panel = function(props) {
  return (
    <section className="border rounded">
      {props.children}
    </section>
  );
}

Panel.propTypes = {
  children: React.PropTypes.node.isRequired
};

Panel.displayName = "Panel";

Panel.Header = Header;
Panel.IntroWithButton = IntroWithButton;
Panel.RowLink = RowLink;
Panel.Body = Body;
Panel.Footer = Footer;

export default Panel;
