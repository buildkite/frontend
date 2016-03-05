import React from "react";
import classNames from 'classnames';
import update from "react-addons-update";

import Badge from "../Badge";
import BaseButton from "../Button";

const COLOR = (Features.NewNav) ? "lime" : "blue";

const Button = (props, context) => {
  // Use a super simpe way of figuring out if the current href is active
  let active = (window.location.pathname.indexOf(props.link || props.href) == 0)

  let badge;
  if(props.badge) {
    let badgeClasses = classNames(`right hover-${COLOR}-child`, {
      "bg-lime": (active && COLOR == "lime"),
      "bg-blue": (active && COLOR == "blue")
    })

    badge = <Badge className={badgeClasses}>{props.badge}</Badge>
  }

  props = update(props, {
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
    <BaseButton {...props}>{props.children}{badge}</BaseButton>
  )
}

Button.propTypes = {
  children: React.PropTypes.node.isRequired,
  badge: React.PropTypes.number,
  href: React.PropTypes.string,
  link: React.PropTypes.string
};

Button.displayName = "Menu.Button";

export default Button;
