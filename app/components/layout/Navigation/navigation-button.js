import React from 'react';
import classNames from 'classnames';

class NavigationButton extends React.Component {
  static displayName = "Navigation.NavigationButton";

  static propTypes = {
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    href: React.PropTypes.string,
    children: React.PropTypes.node,
    onClick: React.PropTypes.func
  };

  render() {
    return (
      <a href={this.props.href} style={this.props.style} className={classNames("btn black hover-lime focus-lime flex items-center flex-none semi-bold", this.props.className)} onClick={this.props.onClick}>
        {this.props.children}
      </a>
    );
  }
}

export default NavigationButton;
