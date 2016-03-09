import React from "react";

import Icon from "../Icon";

class Menu extends React.Component {
  static displayName = "PageHeader.Menu";

  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    // Insert a seperator between each button in the menu
    let nodes = [];
    var k = 0;
    for(var i = 0, l = children.length; i < l; i++) {
      if(i > 0) {
	nodes.push(<Icon key={k += 1} icon="circle" className="muted dark-gray bold" style={{width: 6, height: 6}} />);
      }
      nodes.push(children[i]);
    }

    return (
      <div>
        <div className="rounded flex items-center" style={{backgroundColor: "#f0f1f2"}}>
          {nodes}
        </div>
      </div>
    )
  }
}

export default Menu;
