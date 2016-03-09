import React from "react";
import classNames from "classnames";

import Image from "./image";
import Description from "./description";

class Media extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    return (
      <section className={classNames("flex items-center", this.props.className)}>
        {this.props.children}
      </section>
    );
  }
}

Media.Image = Image;
Media.Description = Description;

export default Media;
