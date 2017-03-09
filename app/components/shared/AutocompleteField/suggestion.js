import React from 'react';
import classNames from 'classnames';

class Suggestion extends React.Component {
  static displayName = "AutocompleteField.Suggestion";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    selected: React.PropTypes.bool.isRequired,
    suggestion: React.PropTypes.object.isRequired,
    onMouseOver: React.PropTypes.func.isRequired,
    onMouseDown: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  };

  static childContextTypes = {
    autoCompletorSuggestion: React.PropTypes.object
  };

  // Pass suggestion information down to the children of this component so they
  // can handle `selected` highlights if they want
  getChildContext() {
    return {
      autoCompletorSuggestion: {
        selected: this.props.selected,
        data: this.props.suggestion
      }
    };
  }

  render() {
    const classes = classNames(this.props.className, "px2 py1", {
      "bg-blue white": this.props.selected
    });

    return (
      <li className={classes} onMouseDown={this.handleMouseDown} onMouseOver={this.handleMouseOver}>
        {this.props.children}
      </li>
    );
  }

  handleMouseDown = (evt) => {
    evt.preventDefault();
    this.props.onMouseDown(this.props.suggestion);
  }

  handleMouseOver = () => {
    this.props.onMouseOver(this.props.suggestion);
  }
}

export default Suggestion;
