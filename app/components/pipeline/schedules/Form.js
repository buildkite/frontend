import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

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
    this.labelTextField.focus();
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
          help={"The interval for when builds will be created, in UTC, using crontab format. See the <a class=\"lime\" href=\"/docs/builds/scheduled-builds\">Scheduled Builds</a> documentation for more information and examples."}
          required={true}
          errors={errors.findForField("cronline")}
          value={this.props.cronline}
          ref={(cronlineTextField) => this.cronlineTextField = cronlineTextField}
        />

        <FormTextField
          label="Build Message"
          help="The message to use for the build."
          errors={errors.findForField("message")}
          value={this.props.message || "Scheduled build"}
          required={true}
          ref={(messageTextField) => this.messageTextField = messageTextField}
        />

        <FormTextField
          label="Build Commit"
          help="The commit ref to use for the build."
          errors={errors.findForField("commit")}
          value={this.props.commit || "HEAD"}
          required={true}
          ref={(commitTextField) => this.commitTextField = commitTextField}
        />

        <FormTextField
          label="Build Branch"
          help="The branch to use for the build."
          errors={errors.findForField("branch")}
          value={this.props.branch || this.props.pipeline.defaultBranch}
          required={true}
          ref={(branchTextField) => this.branchTextField = branchTextField}
        />

        <FormTextarea
          label="Build Environment Variables"
          help={<span>The environment variables to use for the build, each on a new line. e.g. <code>FOO=bar</code></span>}
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
