import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import DocumentTitle from 'react-document-title';

import PipelineScheduleUpdateMutation from 'app/mutations/PipelineScheduleUpdate';
import GraphQLErrors from 'app/constants/GraphQLErrors';

import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';

import Form from './Form';

class Edit extends React.Component {
  static propTypes = {
    pipelineSchedule: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      cronline: PropTypes.string.isRequired,
      label: PropTypes.string,
      commit: PropTypes.string,
      branch: PropTypes.string,
      message: PropTypes.string,
      enabled: PropTypes.bool.isRequired,
      env: PropTypes.arrayOf(PropTypes.string),
      pipeline: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        organization: PropTypes.shape({
          slug: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    saving: false,
    errors: null
  };

  render() {
    return (
      <DocumentTitle title={`Update`}>
        <form onSubmit={this.handleFormSubmit}>
          <Panel>
            <Panel.Header>Update Schedule</Panel.Header>

            <Panel.Section>
              <Form
                pipeline={this.props.pipelineSchedule.pipeline}
                errors={this.state.errors}
                cronline={this.props.pipelineSchedule.cronline}
                label={this.props.pipelineSchedule.label}
                commit={this.props.pipelineSchedule.commit}
                branch={this.props.pipelineSchedule.branch}
                message={this.props.pipelineSchedule.message}
                enabled={this.props.pipelineSchedule.enabled}
                env={this.props.pipelineSchedule.env.join("\n")}
                ref={(form) => this.form = form}
              />
            </Panel.Section>

            <Panel.Footer>
              <Button loading={this.state.saving ? "Saving schedule…" : false} theme="success">Save Schedule</Button>
            </Panel.Footer>
          </Panel>
        </form>
      </DocumentTitle>
    );
  }

  handleFormSubmit = (evt) => {
    evt.preventDefault();

    this.setState({ saving: true });

    // NOTE: `this.form.refs.component` is used because `this.form` is a RelayContainer!
    const data = this.form.refs.component.getFormData();
    const mutation = new PipelineScheduleUpdateMutation({ ...data, pipelineSchedule: this.props.pipelineSchedule });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    const error = transaction.getError();
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = () => {
    const pipeline = this.props.pipelineSchedule.pipeline;
    const organization = this.props.pipelineSchedule.pipeline.organization;

    this.context.router.push(`/${organization.slug}/${pipeline.slug}/settings/schedules/${this.props.pipelineSchedule.uuid}`);
  };
}

export default Relay.createContainer(Edit, {
  fragments: {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        ${PipelineScheduleUpdateMutation.getFragment('pipelineSchedule')}
        uuid
        cronline
        label
        commit
        branch
        message
        enabled
        env
        pipeline {
          ${Form.getFragment('pipeline')}
          slug
          organization {
            slug
          }
        }
      }
    `
  }
});
