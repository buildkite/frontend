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
    slug: dasherize(props.name)
  };

  render() {
    var errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <FormTextField
	  label="Team name"
          help={this._teamNameHelpText()}
          errors={errors.findForField("name")}
          value={this.props.name}
          onChange={this._handleTeamNameChange.bind(this)} />

        <FormTextField
	  label="Description"
          help="Some helpful information about the team"
          errors={errors.findForField("description")}
          value={this.props.description}
          onChange={this._handleDescriptionChange.bind(this)} />
      </div>
    );
  }

  _teamNameHelpText() {
    if(this.state && this.state.slug) {
      return `This team's slug will be: <code>${this.state.slug}</code>`;
    } else {
      return "What you call the team";
    }
  }

  _handleTeamNameChange(e) {
    this.setState({ slug: dasherize(e.target.value) });
    this.props.onChange('name', e.target.value);
  }

  _handleDescriptionChange(e) {
    this.props.onChange('description', e.target.value);
  }
}

export default Form
