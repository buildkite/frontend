import React from 'react';
import PropTypes from 'prop-types';

import FormTextField from '../shared/FormTextField';
import FormRadioGroup from '../shared/FormRadioGroup';
import ValidationErrors from '../../lib/ValidationErrors';
import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

class TeamForm extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    privacy: PropTypes.oneOf(Object.keys(TeamPrivacyConstants)),
    errors: PropTypes.array,
    onChange: PropTypes.func
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

        <FormRadioGroup
          name="team-privacy"
          label="Visibility"
          help="Something"
          value={this.props.privacy}
          errors={errors.findForField("privacy")}
          onChange={this.handlePrivacyChange}
          options={[
          { label: "Visible", value: TeamPrivacyConstants.VISIBLE, help: "Can be seen by all members within the organization" },
          { label: "Secret", value: TeamPrivacyConstants.SECRET, help: "Can only only be seen by organization administrators and members of this team" }
          ]}
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

  handlePrivacyChange = (evt) => {
    this.props.onChange('privacy', evt.target.value);
  };
}

export default TeamForm;
