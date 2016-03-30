import React from 'react';

import FormTextField from '../shared/FormTextField';
import ValidationErrors from '../../lib/ValidationErrors';

class Form extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    errors: React.PropTypes.array,
    onChange: React.PropTypes.func
  };

  componentDidMount() {
    this.nameTextField.focus();
  }

  render() {
    var errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <FormTextField
          label="Name"
          errors={errors.findForField("name")}
          value={this.props.name}
          onChange={this.handleTeamNameChange}
          ref={(c) => this.nameTextField = c} />

        <FormTextField
          label="Description"
          errors={errors.findForField("description")}
          value={this.props.description}
          onChange={this.handleDescriptionChange} />
      </div>
    );
  }

  handleTeamNameChange = (e) => {
    this.props.onChange('name', e.target.value);
  };

  handleDescriptionChange = (e) => {
    this.props.onChange('description', e.target.value);
  };
}

export default Form
