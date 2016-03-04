import React from "react";

import Header from "./header";
import IntroWithButton from "./intro-with-button";
import RowLink from "./row-link";

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

export default Panel;
