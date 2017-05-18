import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import FormTextField from '../../shared/FormTextField';
import FormTextarea from '../../shared/FormTextarea';
import ValidationErrors from '../../../lib/ValidationErrors';

class Form extends React.Component {
  static propTypes = {
    cronline: PropTypes.string,
    label: PropTypes.string,
    commit: PropTypes.string,
    branch: PropTypes.string,
    message: PropTypes.string,
    env: PropTypes.string,
    errors: PropTypes.array,
    pipeline: PropTypes.shape({
      defaultBranch: PropTypes.string.isRequired
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
          label="Description"
          help="The description for the schedule (supports :emoji:)"
          required={true}
          errors={errors.findForField("label")}
          value={this.props.label}
          ref={(labelTextField) => this.labelTextField = labelTextField}
        />

        <FormTextField
          label="Cron Interval"
          help={"The interval for when builds will be created, in UTC, using <a class=\"lime\" target=\"_blank\" rel=\"noopener\" href=\"https://crontab.guru\">cron format</a>. Also supports <code>@monthly</code>, <code>@weekly</code>, <code>@daily</code>, <code>@midnight</code>, and <code>@hourly</code>. For example, <code>30 * * * *</code> creates a build on the 30th minute of every hour."}
          required={true}
          errors={errors.findForField("cronline")}
          value={this.props.cronline}
          ref={(cronlineTextField) => this.cronlineTextField = cronlineTextField}
        />

        <FormTextField
          label="Message"
          help="The message to use for the build. Default: “Scheduled Build for (Pipeline Name)”"
          errors={errors.findForField("message")}
          value={this.props.message}
          ref={(messageTextField) => this.messageTextField = messageTextField}
        />

        <FormTextField
          label="Commit"
          help="The commit to use for the build. Default: “HEAD”"
          errors={errors.findForField("commit")}
          value={this.props.commit}
          ref={(commitTextField) => this.commitTextField = commitTextField}
        />

        <FormTextField
          label="Branch"
          help={`The branch to use for the build. Default: the pipeline’s default branch (currently “${this.props.pipeline.defaultBranch}”)`}
          errors={errors.findForField("branch")}
          value={this.props.branch}
          ref={(branchTextField) => this.branchTextField = branchTextField}
        />

        <FormTextarea
          label="Environment Variables"
          help="The environment variables to use for the build, each on a new line. e.g. <code>FOO=bar</code>"
          className="input"
          rows={2}
          autoresize={true}
          errors={errors.findForField("env")}
          value={this.props.env}
          ref={(envTextField) => this.envTextField = envTextField}
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
