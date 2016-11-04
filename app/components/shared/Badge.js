import React from "react";
import classNames from 'classnames';

class Badge extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string
  };

  render() {
    const { children, className } = this.props;

    const badgeClassName = classNames(
      "inline-block bg-black white rounded ml1 small p1 line-height-1 tabular-numerals",
      className
    );

    return (
      <span className={badgeClassName}>{children}</span>
    );
  }
}

export default Badge;
