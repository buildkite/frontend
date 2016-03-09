import React from "react";
import update from "react-addons-update";
import classNames from "classnames";
import { Link } from 'react-router';

const NORMAL_THEMES = {
  primary: "btn-primary",
  success: "btn-primary bg-green",
  warning: "btn-primary bg-orange",
  default: "btn-primary bg-gray",
  error: "btn-primary bg-red"
};

const OUTLINE_THEMES = {
  primary: "btn-outline border-blue blue",
  success: "btn-outline border-green green",
  warning: "btn-outline border-orange orange",
  default: "btn-outline border-gray",
  error: "btn-outline border-red red"
};

class Button extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    link: React.PropTypes.string,
    href: React.PropTypes.string,
    outline: React.PropTypes.bool,
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

  static defaultProps = {
    theme: 'primary'
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  render() {
    let children = this.props.children;
    if(this.props.loading) {
      children = (
        <span>
          <i className="fa fa-spinner fa-spin icon-mr"></i>{this.props.loading}
        </span>
      )
    }

    // Figure out which set of themese to use
    let themes = (this.props.outline) ? OUTLINE_THEMES : NORMAL_THEMES;

    // Merge the "btn" class onto the props, and toggle the disabled state
    // depending on whether or not this button is in it's "loading" state.
    let props = update(this.props, {
      className: {
        $set: classNames("btn nowrap", this.props.className, themes[this.props.theme], { "is-disabled": !!this.props.loading })
      },
      disabled: {
        $set: !!this.props.loading
      }
    });

    // If we've defined a link instead of a href (a link is used to navigate
    // through react-router, instead of a regular href) and context.router is
    // present (which means the routing gear has been activated) then create a
    // react-router link - otherwise, just fallback to a regular href.
    if(props.link && this.context.router) {
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
}

export default Button
