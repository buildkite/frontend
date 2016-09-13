import React from 'react';
import classNames from 'classnames';

class ErrorMessage extends React.Component {
  static displayName = "FormAutoCompleteField.ErrorMessage";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string
  };

  render() {
    const classes = classNames(this.props.className, "px2 py2 dark-gray");

    return (
      <li className={classes}>{this.props.children}</li>
    );
  }
}

export default ErrorMessage;
