import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Option extends React.Component {
  static displayName = "Chooser.Option";

  static propTypes = {
    tag: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    unselectedClassName: PropTypes.string,
    selectedClassName: PropTypes.string,
    value: PropTypes.any.isRequired,
    data: PropTypes.any
  };

  static contextTypes = {
    chooser: PropTypes.object.isRequired
  };

  static defaultProps = {
    tag: 'div'
  };

  render() {
    const selectionClasses = this.context.chooser.isSelected(this.props.value) ? this.props.selectedClassName : this.props.unselectedClassName;
    const classes = classNames(this.props.className, selectionClasses);

    return React.DOM[this.props.tag]({ className: classes, onClick: this.handleClick }, this.props.children);
  }

  handleClick = (evt) => {
    evt.preventDefault();

    this.context.chooser.handleChoiceClick(this.props.value, this.props.data);
  }
}

export default Option;
