import React from "react";
import classNames from "classnames";

class Section extends React.Component {
  static displayName = "Panel.Section";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    let classes = classNames("p3 border-top border-gray", this.props.className);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

export default Section;
