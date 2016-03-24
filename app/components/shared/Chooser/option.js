import React from "react";
import classNames from "classnames";

class Option extends React.Component {
  static displayName = "Chooser.Option";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    unselectedClassName: React.PropTypes.string,
    selectedClassName: React.PropTypes.string,
    value: React.PropTypes.any.isRequired
  };

  static contextTypes = {
    chooser: React.PropTypes.object.isRequired
  };

  render() {
    let classes = this.context.chooser.isSelected(this.props.value) ? this.props.selectedClassName : this.props.unselectedClassName;

    return (
      <div className={classNames(this.props.className, classes)} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }

  handleClick = (e) => {
    e.preventDefault();

    this.context.chooser.handleChoiceClick(this.props.value);
  }
}

export default Option;
