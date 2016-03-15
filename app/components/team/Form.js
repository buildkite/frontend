import React from 'react';

import FormTextField from '../shared/FormTextField';
import ValidationErrors from '../../lib/ValidationErrors';
import dasherize from '../../lib/dasherize';

class Form extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    errors: React.PropTypes.array,
    onChange: React.PropTypes.func
  };

  state = {
    slug: dasherize(this.props.name)
  };

  render() {
    var errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <FormTextField
          label="Team Name"
          help={this.generateTeamNameHelpText()}
          errors={errors.findForField("name")}
          value={this.props.name}
          onChange={this.handleTeamNameChange} />

        <FormTextField
          label="Description"
          help="Some helpful information about the team"
          errors={errors.findForField("description")}
          value={this.props.description}
          onChange={this.handleDescriptionChange} />
      </div>
    );
  }

  generateTeamNameHelpText() {
    if(this.state && this.state.slug) {
      return `This team's slug will be: <code>${this.state.slug}</code>`;
    } else {
      return "What you call the team";
    }
  }

  handleTeamNameChange = (e) => {
    this.setState({ slug: dasherize(e.target.value) });
    this.props.onChange('name', e.target.value);
  };

  handleDescriptionChange = (e) => {
    this.props.onChange('description', e.target.value);
  };
}

export default Form
