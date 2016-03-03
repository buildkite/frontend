import React from "react";
import classNames from 'classnames';
import Badge from "../shared/Badge";

const COLOR = function() {
  if(Features.NewNav) {
    return "lime";
  } else {
    return "blue";
  }
}()

const Header = function(props) {
  return (
    <div className="border bg-silver py2 px3 semi-bold rounded-top">
      {props.children}
    </div>
  );
}

Header.propTypes = {
  children: React.PropTypes.node.isRequired
};

const List = function(props) {
  let children = React.Children.toArray(props.children);

  // See if the first child is a header component
  let header;
  let buttons;
  if(children[0].type.name == "Header") {
    header = children[0];
    buttons = children.slice(1);
  } else {
    buttons = children;
  }

  // Toggle the presence of the top border in the list if there isn't a header
  let classes = classNames("list-reset py1", {
    "border rounded": !header,
    "border-bottom border-left border-right rounded-bottom": header
  });

  return (
    <div>
      {header}
      <ul className={classes}>
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
    let badgeClasses = classNames(`right hover-${COLOR}-child`, {
      "bg-lime": (active && COLOR == "lime"),
      "bg-blue": (active && COLOR == "blue")
    })

    badge = <Badge className={badgeClasses}>{props.badge}</Badge>
  }

  let buttonClasses = classNames(`btn block hover-${COLOR} focus-${COLOR}`, {
    "lime": (active && COLOR == "lime"),
    "blue": (active && COLOR == "blue")
  })

  return (
    <a href={props.href} className={buttonClasses}>{props.children}{badge}</a>
  );
}

Button.propTypes = {
  children: React.PropTypes.node.isRequired,
  badge: React.PropTypes.number,
  href: React.PropTypes.string
};

export { List, Header, Button }
