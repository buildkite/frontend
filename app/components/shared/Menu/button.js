import React from "react";
import classNames from 'classnames';
import { Link } from 'react-router';

import Badge from "../Badge";

const COLOR = (Features.NewNav) ? "lime" : "blue";

const Button = (props, context) => {
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

  // If we've defined a link instead of a href (a link is used to navigate
  // through react-router, instead of a regular href) and context.router is
  // present (which means the routing gear has been activated) then create a
  // react-router link - otherwise, just fallback to a regular href.
  if(props.link && context.router) {
    return (
      <Link to={props.link} className={buttonClasses}>{props.children}{badge}</Link>
    );
  } else {
    return (
      <a href={props.link || props.href} className={buttonClasses}>{props.children}{badge}</a>
    );
  }
}

Button.propTypes = {
  children: React.PropTypes.node.isRequired,
  badge: React.PropTypes.number,
  href: React.PropTypes.string,
  link: React.PropTypes.string
};

Button.contextTypes = {
  router: React.PropTypes.object
};

Button.displayName = "Menu.Button";

export default Button;
