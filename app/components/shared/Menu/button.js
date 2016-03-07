import React from "react";
import classNames from 'classnames';
import update from "react-addons-update";

import Badge from "../Badge";
import BaseButton from "../Button";

const COLOR = (Features.NewNav) ? "lime" : "blue";

class Button extends React.Component {
  static displayName = "Menu.Button";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    badge: React.PropTypes.number,
    href: React.PropTypes.string,
    link: React.PropTypes.string
  };

  render() {
    // Use a super simpe way of figuring out if the current href is active
    let active = (window.location.pathname.indexOf(this.props.link || this.props.href) == 0)

    let badge;
    if(this.props.badge) {
      let badgeClasses = classNames(`right hover-${COLOR}-child`, {
        "bg-lime": (active && COLOR == "lime"),
        "bg-blue": (active && COLOR == "blue")
      })

      badge = <Badge className={badgeClasses}>{this.props.badge}</Badge>
    }

    let buttonProps = update(this.props, {
      theme: {
        $set: false
      },
      className: {
        $set: classNames(`block hover-${COLOR} focus-${COLOR} truncate`, {
          "lime": (active && COLOR == "lime"),
          "blue": (active && COLOR == "blue")
        })
      }
    });

    return (
      <BaseButton {...buttonProps}>{buttonProps.children}{badge}</BaseButton>
    )
  }
}

export default Button;
