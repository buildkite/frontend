import React from "react";

import BaseButton from "../Button";

class Button extends React.Component {
  static displayName = "PageHeader.Button";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <BaseButton {...this.props} theme="default" outline={true} className="ml1">{this.props.children}</BaseButton>
    )
  }
}

export default Button;
