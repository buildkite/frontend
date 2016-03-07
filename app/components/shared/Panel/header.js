import React from "react";

class Header extends React.Component {
  static displayName = "Panel.Header";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="border-bottom border-gray bg-silver py2 px3 semi-bold">
        {this.props.children}
      </div>
    );
  }
}

export default Header;
