import React from 'react';
import PropTypes from 'prop-types';

export default class FormInputErrors extends React.PureComponent {
  static propTypes = {
    errors: PropTypes.array.isRequired
  };

  render() {
    return (
      <p className="mt1 mb2 p0 red">{this.props.errors.join(", ")}</p>
    );
  }
}
