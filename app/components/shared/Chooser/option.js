import React from "react";
import classNames from "classnames";

class Option extends React.Component {
  static displayName = "Chooser.Option";

  static propTypes = {
    tag: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    unselectedClassName: React.PropTypes.string,
    selectedClassName: React.PropTypes.string,
    value: React.PropTypes.any.isRequired,
    data: React.PropTypes.any
  };

  static contextTypes = {
    chooser: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    tag: 'div'
  };

  render() {
    const selectionClasses = this.context.chooser.isSelected(this.props.value) ? this.props.selectedClassName : this.props.unselectedClassName;
    const classes = classNames(this.props.className, selectionClasses);

    return React.DOM[this.props.tag]({ className: classes, onClick: this.handleClick }, this.props.children);
  }

  handleClick = (e) => {
    e.preventDefault();

    this.context.chooser.handleChoiceClick(this.props.value, this.props.data);
  }
}

export default Option;
