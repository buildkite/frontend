import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PipelineScheduleCreateMutation from '../../../mutations/PipelineScheduleCreate';
import GraphQLErrors from '../../../constants/GraphQLErrors';

import PageHeader from '../../shared/PageHeader';
import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import PageWithContainer from '../../shared/PageWithContainer';

import Form from "./Form";

class New extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired
    }).isRequired,
    params: React.PropTypes.shape({
      organization: React.PropTypes.string.isRequired,
      pipeline: React.PropTypes.string.isRequired
    }).isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    saving: false,
    errors: null
  };

  render() {
    return (
      <DocumentTitle title={`Schedules · ${this.props.pipeline.name}`}>
        <PageWithContainer>
          <form onSubmit={this.handleFormSubmit}>
            <PageHeader>
              <PageHeader.Title>Create a Schedule</PageHeader.Title>
            </PageHeader>

            <Panel>
              <Panel.Section>
                <Form pipeline={this.props.pipeline} errors={this.state.errors} ref={(c) => this.form = c} />
              </Panel.Section>

              <Panel.Footer>
                <Button loading={this.state.saving ? "Creating schedule…" : false} theme="success">Create Schedule</Button>
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

    const data = this.form.refs.component.getFormData();
    const mutation = new PipelineScheduleCreateMutation({ ...data, pipeline: this.props.pipeline });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    const error = transaction.getError();
    if (error) {
      if (error.source && error.source.type == GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = (response) => {
    this.context.router.push(`/${this.props.params.organization}/${this.props.params.pipeline}/settings/schedules/${response.pipelineScheduleCreate.pipelineScheduleEdge.node.uuid}`);
  };
}

export default Relay.createContainer(New, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
        ${Form.getFragment('pipeline')}
        ${PipelineScheduleCreateMutation.getFragment('pipeline')}
      }
    `
  }
});
