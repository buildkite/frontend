import React from "react";
import classNames from "classnames";

import classed from "./ClassedComponent";

class Media extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    align: React.PropTypes.string
  };

  render() {
    const alignment = (this.props.align === "top") ? "items-top" : "items-center";

    return (
      <section className={classNames("flex", alignment, this.props.className)}>
        {this.props.children}
      </section>
    );
  }
}

const SIMPLE_COMPONENTS = {
  Image: 'flex-no-shrink',
  Description: ''
};

Object.keys(SIMPLE_COMPONENTS).forEach((componentName) => {
  const Component = classed('div', SIMPLE_COMPONENTS[componentName]);
  Component.displayName = `Media.${componentName} (née \`${Component.displayName}\`)`;
  Media[componentName] = Component;
});

export default Media;
