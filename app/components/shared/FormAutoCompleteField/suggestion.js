import React from 'react';
import classNames from 'classnames';

class Suggestion extends React.Component {
  static displayName = "FormAutoCompleteField.Suggestion";

  static propTypes = {
    selected: React.PropTypes.bool,
    suggestion: React.PropTypes.object
  };

  render() {
    var suggestionClassNames = classNames({
      "FormAutoCompleteField__Suggestions__List__Item": !this.props.selected,
      "FormAutoCompleteField__Suggestions__List__Item--Selected": this.props.selected
    });

    return (
      <li className={suggestionClassNames} onMouseDown={this.handleMouseDown} onMouseOver={this.handleMouseOver}>
        {this.props.children}
      </li>
    );
  }

  handleMouseDown = (e) => {
    e.preventDefault()
    this.props.onMouseDown(this.props.suggestion);
  }

  handleMouseOver = (e) => {
    this.props.onMouseOver(this.props.suggestion);
  }
}

export default Suggestion;
