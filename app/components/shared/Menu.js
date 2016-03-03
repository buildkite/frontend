import React from "react";
import classNames from 'classnames';
import Badge from "../shared/Badge";

class List extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    let children = React.Children.toArray(this.props.children);
    let header = children[0];
    let buttons = children.slice(1);

    return (
      <div>
        <div className="border bg-silver py2 px3 semi-bold rounded-top">
          {header}
        </div>
        <ul className="list-reset border-left border-bottom border-left border-right rounded-bottom py1">
          {buttons.map((b, i) => {
            return (
              <li key={i}>{b}</li>
            )
          })}
        </ul>
      </div>
    );
  }
}

class Button extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    let active = (window.location.pathname.indexOf(this.props.href) == 0)

    let badge;
    if(this.props.badge) {
      badge = <Badge className={classNames("right hover-lime-child", { "bg-lime": active })}>{this.props.badge}</Badge>
    }

    return (
      <a href={this.props.href} className={classNames("btn block hover-lime focus-lime", { "lime": active })}>{this.props.children}{badge}</a>
    );
  }
}

export { List, Button }
