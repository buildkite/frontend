import React from "react";
import classNames from "classnames";
import { Link } from 'react-router';

const NORMAL_THEMES = {
  primary: "btn-primary",
  success: "btn-primary bg-lime",
  warning: "btn-primary bg-orange",
  default: "btn-primary bg-gray",
  error: "btn-primary bg-red"
};

const OUTLINE_THEMES = {
  primary: "btn-outline border-blue blue",
  success: "btn-outline border-lime lime",
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
    style: React.PropTypes.object,
    onClick: React.PropTypes.func,
    tabIndex: React.PropTypes.number,
    type: React.PropTypes.string,
    loading: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.bool
    ]),
    theme: React.PropTypes.oneOf([
      'default',
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
    let props = {
      className: classNames("btn nowrap", this.props.className, themes[this.props.theme], { "is-disabled": !!this.props.loading }),
      disabled: !!this.props.loading,
      style: this.props.style,
      onClick: this.props.onClick,
      tabIndex: this.props.tabIndex,
      type: this.props.type
    };

    // If we've defined a link instead of a href (a link is used to navigate
    // through react-router, instead of a regular href) and context.router is
    // present (which means the routing gear has been activated) then create a
    // react-router link - otherwise, just fallback to a regular href.
    if(this.props.link && this.context.router) {
      return (
        <Link to={this.props.link} {...props}>{children}</Link>
      );
    } else {
      props.href = this.props.link || this.props.href;

      if(props.href) {
        return React.DOM.a(props, children)
      } else {
        return React.DOM.button(props, children)
      }
    }
  }
}

export default Button
