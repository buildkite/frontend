import React from "react";
import classNames from 'classnames';

class Badge extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string
  };

  render() {
    return (
      <span className={classNames("inline-block bg-black white rounded ml1 small p1 line-height-1", this.props.className)}>
        {this.props.children}
      </span>
    );
  }
}

export default Badge;
