import React from "react";

import Option from "./option";
import SelectOption from "./select-option";

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
    if (this.props.multiple) {
      return this.props.selected.indexOf(value) >= 0;
    } else {
      return this.props.selected === value;
    }
  }

  handleChoiceClick = (value, data) => {
    this.props.onSelect(value, data);
  }
}

Chooser.Option = Option;
Chooser.SelectOption = SelectOption;

export default Chooser;
