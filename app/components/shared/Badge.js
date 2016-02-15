import React from "react";
import classNames from 'classnames';

export default function Badge(props) {
  return (
    <span className={classNames("inline-block bg-black white rounded ml1 small p1 line-height-1", props.className)}>
      {props.children}
    </span>
  );
}

Badge.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
}
