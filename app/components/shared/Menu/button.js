import React from "react";
import classNames from 'classnames';

import Badge from "../Badge";
import BaseButton from "../Button";

class Button extends React.Component {
  static displayName = "Menu.Button";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    badge: React.PropTypes.number,
    href: React.PropTypes.string,
    link: React.PropTypes.string
  };

  render() {
    return (
      <BaseButton className={classNames(`block hover-lime focus-lime truncate`, { "lime": this._isActive() })}
                  theme={false}
                  href={this.props.href}
                  link={this.props.link}>
        <div className="flex">
          <div className="flex-auto">{this.props.children}</div>
          <div className="flex-none">{this._renderBadge()}</div>
        </div>
      </BaseButton>
    )
  }

  _isActive() {
    // Use a super simpe way of figuring out if the current href is active
    return window.location.pathname.indexOf(this.props.link || this.props.href) == 0;
  }

  _renderBadge() {
    if(this.props.badge) {
      return (
        <Badge className={classNames(`hover-lime-child`, { "bg-lime": this._isActive() })}>
          {this.props.badge}
        </Badge>
      );
    }
  }
}

export default Button;

