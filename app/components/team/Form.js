import React from 'react';
import PropTypes from 'prop-types';
import reffer from 'reffer';

import FormCheckbox from '../shared/FormCheckbox';
import FormInputLabel from '../shared/FormInputLabel';
import FormRadioGroup from '../shared/FormRadioGroup';
import FormTextField from '../shared/FormTextField';
import ValidationErrors from '../../lib/ValidationErrors';
import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

class TeamForm extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    privacy: PropTypes.oneOf(Object.keys(TeamPrivacyConstants)),
    isDefaultTeam: PropTypes.bool,
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
          help="The name for the team (supports :emoji:)"
          errors={errors.findForField("name")}
          value={this.props.name}
          onChange={this.handleTeamNameChange}
          ref={this::reffer('nameTextField')}
        />

        <FormTextField
          label="Description"
          help="The description for the team (supports :emoji:)"
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

        <FormInputLabel label="Default" />

        <FormCheckbox
          name="team-is-default-team"
          label="Automatically add new users to this team"
          help="Users will automatically be added to this team when they sign in with SSO"
          checked={this.props.isDefaultTeam}
          onChange={this.handleIsDefaultTeamChange}
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

  handleIsDefaultTeamChange = (evt) => {
    this.props.onChange('isDefaultTeam', evt.target.checked);
  };
}

export default TeamForm;
