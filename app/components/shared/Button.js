import React from "react";
import update from "react-addons-update";
import classNames from "classnames";
import { Link } from 'react-router';

const THEMES = {
  outline: "btn-outline",
  primary: "btn-primary nowrap",
  success: "btn-primar bg-green nowrap",
  warning: "btn-primary bg-orange nowrap",
  error: "btn-primary bg-red nowrap"
};

const Button = (props, context) => {
  let children = props.children;
  if(props.loading) {
    children = (
      <span>
        <i className="fa fa-spinner fa-spin icon-mr"></i>{props.loading}
      </span>
    )
  }

  // Merge the "btn" class onto the props, and toggle the disabled state
  // depending on whether or not this button is in it's "loading" state.
  props = update(props, {
    className: {
      $set: classNames("btn", props.className, THEMES[props.theme], { "is-disabled": !!props.loading })
    },
    disabled: {
      $set: !!props.loading
    }
  });

  // If we've defined a link instead of a href (a link is used to navigate
  // through react-router, instead of a regular href) and context.router is
  // present (which means the routing gear has been activated) then create a
  // react-router link - otherwise, just fallback to a regular href.
  if(props.link && context.router) {
    return (
      <Link to={props.link} {...props}>{children}</Link>
    );
  } else {
    // Since we're rendering a regular button (not a react-router one) we need
    // to ensure the href has a value (if it wanted to be a react-router link,
    // but couldn't, we'll just fallback to making it a regular href)
    props = update(props, {
      href: {
        $set: props.link || props.href
      }
    });

    // Toggle between an "a" and "button" tag depending on whether or not a
    // "href" was specified
    return React.DOM[props.href ? 'a' : 'button'](props, children)
  }
}

Button.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  link: React.PropTypes.string,
  href: React.PropTypes.string,
  loading: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  theme: React.PropTypes.oneOf([
    'primary',
    'success',
    'warning',
    'error',
    false
  ])
};

Button.defaultProps = {
  theme: 'primary'
};

Button.contextTypes = {
  router: React.PropTypes.object
};

Button.displayName = "Button";

export default Button
