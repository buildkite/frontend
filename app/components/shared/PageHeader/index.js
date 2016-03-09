import React from "react";

import Title from "./title";
import Description from "./description";
import Menu from "./menu";
import Button from "./button";

class PageHeader extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    // Filter out the menu from the children
    let details = [];
    let menu;
    children.forEach((child) => {
      if(child.type.displayName == "PageHeader.Menu") {
        menu = child;
      } else {
        details.push(child);
      }
    });

    return (
      <section className="flex items-top mb4">
        <div className="flex-auto">{details}</div>
        {menu}
      </section>
    );
  }
}

PageHeader.Title = Title;
PageHeader.Description = Description;
PageHeader.Menu = Menu;
PageHeader.Button = Button;

export default PageHeader;
