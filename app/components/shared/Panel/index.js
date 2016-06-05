import React from "react";
import classNames from "classnames";

import Header from "./header";
import IntroWithButton from "./intro-with-button";
import Row from "./row";
import RowActions from "./row-actions";
import RowLink from "./row-link";
import Section from "./section";
import Footer from "./footer";
import Divider from "./divider";

class Panel extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    outline: React.PropTypes.bool
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    // Insert a seperator between each section
    let nodes = [];
    var k = 0;
    for(var i = 0, l = children.length; i < l; i++) {
      if(i > 0) {
	nodes.push(<Divider key={k += 1} />);
      }
      nodes.push(children[i]);
    }

    let className;
    if(this.props.outline == undefined || this.props.outline) {
      className = "border border-gray rounded";
    }

    return (
      <section className={classNames(className, this.props.className)}>
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
Panel.Divider = Divider;

export default Panel;
