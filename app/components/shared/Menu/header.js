import React from "react";

class Header extends React.Component {
  static displayName = "Menu.Header";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="border border-gray bg-silver py2 px3 semi-bold rounded-top">
        {this.props.children}
      </div>
    );
  }
}

export default Header;
