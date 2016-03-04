import React from "react";
import classNames from 'classnames';

import Badge from "../Badge";

const COLOR = (Features.NewNav) ? "lime" : "blue";

const Button = (props) => {
  let active = (window.location.pathname.indexOf(props.href) == 0)

  let badge;
  if(props.badge) {
    let badgeClasses = classNames(`right hover-${COLOR}-child`, {
      "bg-lime": (active && COLOR == "lime"),
      "bg-blue": (active && COLOR == "blue")
    })

    badge = <Badge className={badgeClasses}>{props.badge}</Badge>
  }

  let buttonClasses = classNames(`btn block hover-${COLOR} focus-${COLOR} truncate`, {
    "lime": (active && COLOR == "lime"),
    "blue": (active && COLOR == "blue")
  })

  return (
    <a href={props.href} className={buttonClasses}>{props.children}{badge}</a>
  );
}

Button.propTypes = {
  children: React.PropTypes.node.isRequired,
  badge: React.PropTypes.number,
  href: React.PropTypes.string
};

Button.displayName = "Menu.Button";

export default Button;
