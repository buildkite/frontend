import React from 'react';

class FormInputErrors extends React.Component {
  static propTypes = {
    errors: React.PropTypes.array.isRequired
  };

  render() {
    return (
      <p className="mt1 mb2 p0 red">{this.props.errors.join(", ")}</p>
    );
  }
}

export default FormInputErrors;
