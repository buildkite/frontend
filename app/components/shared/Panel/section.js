import React from "react";
import classNames from "classnames";

class Section extends React.Component {
  static displayName = "Panel.Section";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    const classes = classNames("m3", this.props.className);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

export default Section;
