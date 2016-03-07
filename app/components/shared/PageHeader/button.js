import React from "react";
import update from "react-addons-update";

import BaseButton from "../Button";

class Button extends React.Component {
  static displayName = "PageHeader.Button";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    let buttonProps = update(this.props, {
      theme: {
        $set: false
      },
      className: {
        $set: `dark-gray regular hover-black focus-black truncate`
      }
    });

    return (
      <BaseButton {...buttonProps}>{buttonProps.children}</BaseButton>
    )
  }
}

export default Button;
