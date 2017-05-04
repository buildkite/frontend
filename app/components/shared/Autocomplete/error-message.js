import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ErrorMessage extends React.PureComponent {
  static displayName = "Autocomplete.ErrorMessage";

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    const classes = classNames(this.props.className, "px2 py2 dark-gray");

    return (
      <li className={classes}>{this.props.children}</li>
    );
  }
}
