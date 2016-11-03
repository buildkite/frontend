import React from "react";
import classNames from "classnames";

class Header extends React.Component {
  static displayName = "Panel.Header";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    return (
      <div className={classNames("bg-silver py2 px3 semi-bold", this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

export default Header;
