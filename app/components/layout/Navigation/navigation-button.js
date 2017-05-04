import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';

class NavigationButton extends React.Component {
  static displayName = "Navigation.NavigationButton";

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    linkIf: PropTypes.bool,
    href: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func
  };

  static defaultProps = {
    linkIf: false
  };

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const props = {
      style: this.props.style,
      className: classNames("btn black hover-lime focus-lime flex items-center flex-none semi-bold", this.props.className),
      onClick: this.props.onClick
    };

    // If we've requested a link instead of a href (a link is used to navigate
    // through react-router, instead of a regular href) and context.router is
    // present (which means the routing gear has been activated) then create a
    // react-router link - otherwise, just fallback to a regular href.
    if (this.props.linkIf && this.context.router) {
      return (
        <Link to={this.props.href} {...props}>{this.props.children}</Link>
      );
    } else {
      return (
        <a href={this.props.href} {...props}>{this.props.children}</a>
      );
    }
  }
}

export default NavigationButton;
