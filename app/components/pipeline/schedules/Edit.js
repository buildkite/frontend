import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PipelineScheduleUpdateMutation from '../../../mutations/PipelineScheduleUpdate';
import GraphQLErrors from '../../../constants/GraphQLErrors';

import PageHeader from '../../shared/PageHeader';
import Panel from '../../shared/Panel'
import Button from '../../shared/Button'
import PageWithContainer from '../../shared/PageWithContainer';

import Form from "./form"

class Edit extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    saving: false,
    errors: null
  };

  render() {
    return (
      <DocumentTitle title={`Update`}>
        <PageWithContainer>
          <form onSubmit={this.handleFormSubmit}>
            <PageHeader>
              <PageHeader.Title>Update Schedule</PageHeader.Title>
            </PageHeader>

            <Panel>
              <Panel.Section>
                <Form
                  pipeline={this.props.pipelineSchedule.pipeline}
                  errors={this.state.errors}
                  cronline={this.props.pipelineSchedule.cronline}
                  description={this.props.pipelineSchedule.description}
                  commit={this.props.pipelineSchedule.commit}
                  branch={this.props.pipelineSchedule.branch}
                  message={this.props.pipelineSchedule.message}
                  env={this.props.pipelineSchedule.env.join("\n")}
                  ref={(c) => this.form = c} />
              </Panel.Section>

              <Panel.Footer>
                <Button loading={this.state.saving ? "Saving schedule…" : false} theme="success">Save Schedule</Button>
              </Panel.Footer>
            </Panel>
          </form>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.setState({ saving: true });

    let data = this.form.refs.component.getFormData();
    let mutation = new PipelineScheduleUpdateMutation({ ...data, pipelineSchedule: this.props.pipelineSchedule });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    var error = transaction.getError();
    if(error) {
      if(error.source && error.source.type == GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = (response) => {
    let pipeline = this.props.pipelineSchedule.pipeline;
    let organization = this.props.pipelineSchedule.pipeline.organization;

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
        description
        commit
        branch
        message
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
