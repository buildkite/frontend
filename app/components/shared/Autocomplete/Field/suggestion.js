import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Suggestion extends React.Component {
  static displayName = "AutocompleteField.Suggestion";

  static propTypes = {
    children: PropTypes.node.isRequired,
    selected: PropTypes.bool.isRequired,
    suggestion: PropTypes.object.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  static childContextTypes = {
    autoCompletorSuggestion: PropTypes.object
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
