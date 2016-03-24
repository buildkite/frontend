import React from "react";
import classNames from "classnames";

import Image from "./image";
import Description from "./description";

class Media extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    align: React.PropTypes.string
  };

  render() {
    let alignment = (this.props.align == "top") ? "items-top" : "items-center";

    return (
      <section className={classNames("flex", alignment, this.props.className)}>
        {this.props.children}
      </section>
    );
  }
}

Media.Image = Image;
Media.Description = Description;

export default Media;
