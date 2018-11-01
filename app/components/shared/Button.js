// @flow

import * as React from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';

export const NORMAL_THEMES = {
  primary: "btn-primary",
  success: "btn-primary bg-lime",
  warning: "btn-primary bg-orange",
  default: "btn-primary bg-gray",
  error: "btn-primary bg-red"
};

export const OUTLINE_THEMES = {
  primary: "btn-outline border-blue blue",
  success: "btn-outline border-lime lime",
  warning: "btn-outline border-orange orange",
  default: "btn-outline border-gray hover-black",
  error: "btn-outline border-red red"
};


type Props = {
  children: React.Node,
  className?: string,
  link?: string,
  href?: string,
  outline?: boolean,
  style?: {[string]: string | number},
  onClick?: (event: SyntheticEvent<HTMLButtonElement | HTMLAnchorElement>) => void,
  tabIndex?: number,
  type?: string,
  loading?: string | boolean,
  iconOnly?: boolean,
  theme: $Keys<typeof NORMAL_THEMES>,
  disabled?: boolean
};

export default class Button extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    link: PropTypes.string,
    href: PropTypes.string,
    outline: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func,
    tabIndex: PropTypes.number,
    type: PropTypes.string,
    loading: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    iconOnly: PropTypes.bool,
    theme: PropTypes.oneOf([
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
    router: PropTypes.object
  };

  render() {
    let children = this.props.children;
    if (this.props.loading) {
      children = (
        <span>{this.props.loading}</span>
      );
    }

    // Figure out which set of themese to use
    const themes = (this.props.outline) ? OUTLINE_THEMES : NORMAL_THEMES;

    // Merge the "btn" class onto the props, and toggle the disabled state
    // depending on whether or not this button is in it's "loading" state.
    let props = {
      className: classNames("btn nowrap", this.props.className, themes[this.props.theme], {
        "-icon-only": this.props.iconOnly,
        "is-disabled": (!!this.props.loading || this.props.disabled)
      }),
      disabled: (!!this.props.loading || this.props.disabled),
      style: this.props.style,
      onClick: this.props.onClick,
      tabIndex: this.props.tabIndex,
      type: this.props.type
    };

    // If we've defined a link instead of a href (a link is used to navigate
    // through react-router, instead of a regular href) and context.router is
    // present (which means the routing gear has been activated) then create a
    // react-router link - otherwise, just fallback to a regular href.
    if (this.props.link && this.context.router) {
      return (
        <Link to={this.props.link} {...props}>
          {children}
        </Link>
      );
    }

    props = { ...props, href: this.props.link || this.props.href };

    if (props.href) {
      return (
        <a {...props}>
          {children}
        </a>
      );
    }

    return (
      <button {...props}>
        {children}
      </button>
    );
  }
}
