import React from 'react';
import PropTypes from 'prop-types';

class FormInputErrors extends React.Component {
  static propTypes = {
    errors: PropTypes.array.isRequired
  };

  render() {
    return (
      <p className="mt1 mb2 p0 red">{this.props.errors.join(", ")}</p>
    );
  }
}

export default FormInputErrors;
