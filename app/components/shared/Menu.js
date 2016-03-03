import React from "react";
import classNames from 'classnames';
import Badge from "../shared/Badge";

const List = function(props) {
  let children = React.Children.toArray(props.children);
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

List.propTypes = {
  children: React.PropTypes.node.isRequired
};

const Button = function(props) {
  let active = (window.location.pathname.indexOf(props.href) == 0)

  let badge;
  if(props.badge) {
    badge = <Badge className={classNames("right hover-lime-child", { "bg-lime": active })}>{props.badge}</Badge>
  }

  return (
    <a href={props.href} className={classNames("btn block hover-lime focus-lime", { "lime": active })}>{props.children}{badge}</a>
  );
}

Button.propTypes = {
  children: React.PropTypes.node.isRequired,
  badge: React.PropTypes.number,
  href: React.PropTypes.string
};

export { List, Button }
