import React from "react";

import Header from "./header";
import IntroWithButton from "./intro-with-button";
import Row from "./row";
import RowActions from "./row-actions";
import RowLink from "./row-link";
import Body from "./body";
import Footer from "./footer";

class Panel extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <section className="border border-gray rounded">
        {this.props.children}
      </section>
    );
  }
}

Panel.Header = Header;
Panel.IntroWithButton = IntroWithButton;
Panel.RowLink = RowLink;
Panel.Row = Row;
Panel.RowActions = RowActions;
Panel.Body = Body;
Panel.Footer = Footer;

export default Panel;
