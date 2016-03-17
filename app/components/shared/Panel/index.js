import React from "react";
import classNames from "classnames";

import Header from "./header";
import IntroWithButton from "./intro-with-button";
import Row from "./row";
import RowActions from "./row-actions";
import RowLink from "./row-link";
import Section from "./section";
import Footer from "./footer";

class Panel extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    return (
      <section className={classNames("border border-gray rounded", this.props.className)}>
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
Panel.Section = Section;
Panel.Footer = Footer;

export default Panel;
