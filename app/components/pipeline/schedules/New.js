import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';
import reffer from 'reffer';

import PipelineScheduleCreateMutation from '../../../mutations/PipelineScheduleCreate';
import GraphQLErrors from '../../../constants/GraphQLErrors';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';

import Form from './Form';

class New extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    params: PropTypes.shape({
      organization: PropTypes.string.isRequired,
      pipeline: PropTypes.string.isRequired
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
      <DocumentTitle title={`Schedules · ${this.props.pipeline.name}`}>
        <form onSubmit={this.handleFormSubmit}>
          <Panel>
            <Panel.Header>New Schedule</Panel.Header>

            <Panel.Section>
              <Form pipeline={this.props.pipeline} errors={this.state.errors} ref={this::reffer('form')} />
            </Panel.Section>

            <Panel.Footer>
              <Button loading={this.state.saving ? "Creating schedule…" : false} theme="success">Create Schedule</Button>
            </Panel.Footer>
          </Panel>
        </form>
      </DocumentTitle>
    );
  }

  handleFormSubmit = (evt) => {
    evt.preventDefault();

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
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
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
