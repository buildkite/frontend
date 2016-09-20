import React from 'react';
import Relay from 'react-relay';

import FormTextField from '../../shared/FormTextField';
import FormTextarea from '../../shared/FormTextarea';
import ValidationErrors from '../../../lib/ValidationErrors';

class Form extends React.Component {
  static propTypes = {
    cronline: React.PropTypes.string,
    label: React.PropTypes.string,
    commit: React.PropTypes.string,
    branch: React.PropTypes.string,
    message: React.PropTypes.string,
    env: React.PropTypes.string,
    errors: React.PropTypes.array,
    pipeline: React.PropTypes.shape({
      defaultBranch: React.PropTypes.string.isRequired
    }).isRequired
  };

  componentDidMount() {
    this.cronlineTextField.focus();
  }

  render() {
    const errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <FormTextField
          label="Cron Interval"
          help="The interval or time that this schedule should run using cron syntax, e.g (<code>30 * * * *</code> or <code>@midnight</code>). These times should be in UTC."
          errors={errors.findForField("cronline")}
          value={this.props.cronline}
          ref={(c) => this.cronlineTextField = c}
        />

        <FormTextField
          label="Label"
          help="Describe what this schedule is all about (you can even use :emoji:)"
          errors={errors.findForField("label")}
          value={this.props.label}
          ref={(c) => this.labelTextField = c}
        />

        <FormTextField
          label="Message"
          help="The message to use for the created build"
          errors={errors.findForField("message")}
          value={this.props.message}
          ref={(c) => this.messageTextField = c}
        />

        <FormTextField
          label="Commit"
          help="The commit to use for the created build"
          errors={errors.findForField("commit")}
          value={this.props.commit}
          placeholder={"HEAD"}
          ref={(c) => this.commitTextField = c}
        />

        <FormTextField
          label="Branch"
          help="The branch to use for the created build"
          errors={errors.findForField("branch")}
          value={this.props.branch}
          placeholder={this.props.pipeline.defaultBranch}
          ref={(c) => this.branchTextField = c}
        />

        <FormTextarea
          label="Environment Varibles"
          help="Environment variables to be set, each on a new line. e.g. <code>FOO=bar</code>"
          className="input"
          rows={2}
          autoresize={true}
          errors={errors.findForField("env")}
          value={this.props.env}
          ref={(c) => this.envTextField = c}
        />
      </div>
    );
  }

  getFormData() {
    return {
      cronline: this.cronlineTextField.getValue(),
      label: this.labelTextField.getValue(),
      message: this.messageTextField.getValue(),
      commit: this.commitTextField.getValue(),
      branch: this.branchTextField.getValue(),
      env: this.envTextField.getValue()
    };
  }
}

export default Relay.createContainer(Form, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        defaultBranch
      }
    `
  }
});
