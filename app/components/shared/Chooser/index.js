import React from 'react';
import PropTypes from 'prop-types';

import Option from './option';
import SelectOption from './select-option';

class Chooser extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    multiple: PropTypes.bool,
    selected: PropTypes.any,
    onSelect: PropTypes.func.isRequired
  };

  static childContextTypes = {
    chooser: PropTypes.object.isRequired
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
