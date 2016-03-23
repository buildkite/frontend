import React from "react";
import classNames from "classnames";

import Option from "./option";

class Chooser extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    selected: React.PropTypes.any,
    onSelect: React.PropTypes.func.isRequired
  };

  static childContextTypes = {
    chooser: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      chooser: this
    };
  }

  render() {
    return (
      <section className={this.props.className}>
        {this.props.children}
      </section>
    );
  }

  isSelected(value) {
    if(this.props.multiple) {
      return this.props.selected.indexOf(edge.node.id) >= 0;
    } else {
      return this.props.selected == value;
    }
  }

  handleChoiceClick = (value) => {
    this.props.onSelect(value);
  }
}

Chooser.Option = Option;

export default Chooser;
