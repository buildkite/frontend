import React from "react";

class Menu extends React.Component {
  static displayName = "PageHeader.Menu";

  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    return (
      <div>
        <div className="flex items-center">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Menu;
