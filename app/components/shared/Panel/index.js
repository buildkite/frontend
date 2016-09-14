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
    const children = React.Children.toArray(this.props.children);

    // Insert a seperator between each section
    const nodes = [];
    let k = 0;
    for (let i = 0, l = children.length; i < l; i++) {
      if (i > 0) {
        nodes.push(<hr key={k += 1} className="p0 m0 bg-gray" style={{ border: "none", height: 1 }} />);
      }
      nodes.push(children[i]);
    }

    return (
      <section className={classNames("border border-gray rounded", this.props.className)}>
        {nodes}
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
