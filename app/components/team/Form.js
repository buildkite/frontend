import React from 'react';

import FormTextField from '../shared/FormTextField';
import ValidationErrors from '../../lib/ValidationErrors';

class TeamForm extends React.Component {
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
    const errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <FormTextField
          label="Name"
          help="Pick a name for your team (you can even use :emoji:)"
          errors={errors.findForField("name")}
          value={this.props.name}
          onChange={this.handleTeamNameChange}
          ref={(nameTextField) => this.nameTextField = nameTextField}
        />

        <FormTextField
          label="Description"
          help="Describe what this team is all about"
          errors={errors.findForField("description")}
          value={this.props.description}
          onChange={this.handleDescriptionChange}
        />
      </div>
    );
  }

  handleTeamNameChange = (evt) => {
    this.props.onChange('name', evt.target.value);
  };

  handleDescriptionChange = (evt) => {
    this.props.onChange('description', evt.target.value);
  };
}

export default TeamForm;
