import React from "react";
import classNames from "classnames";

import classed from "../ClassedComponent";

import IntroWithButton from "./intro-with-button";
import Row from "./row";
import RowActions from "./row-actions";
import RowLink from "./row-link";

class Panel extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    const children = React.Children.toArray(this.props.children);

    // Insert a seperator between each section
    const nodes = [];
    let key = 0;
    for (let index = 0, length = children.length; index < length; index++) {
      if (index > 0) {
        nodes.push(<hr key={key += 1} className="p0 m0 bg-gray" style={{ border: "none", height: 1 }} />);
      }

      nodes.push(children[index]);
    }

    return (
      <section className={classNames("border border-gray rounded", this.props.className)}>
        {nodes}
      </section>
    );
  }
}

Panel.IntroWithButton = IntroWithButton;
Panel.Row = Row;
Panel.RowActions = RowActions;
Panel.RowLink = RowLink;

const SIMPLE_COMPONENTS = {
  Header: 'bg-silver py2 px3 semi-bold',
  Footer: 'py2 px3',
  Section: 'm3'
};

Object.keys(SIMPLE_COMPONENTS).forEach((componentName) => {
  const Component = classed('div', SIMPLE_COMPONENTS[componentName]);
  Component.displayName = `Panel.${componentName} (née \`${Component.displayName}\`)`;
  Panel[componentName] = Component;
});

export default Panel;
