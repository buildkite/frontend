import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PipelineScheduleDeleteMutation from '../../../mutations/PipelineScheduleDelete';

import PageHeader from '../../shared/PageHeader';
import Panel from '../../shared/Panel'
import Button from '../../shared/Button'
import PageWithContainer from '../../shared/PageWithContainer';
import Emojify from '../../shared/Emojify';

import permissions from '../../../lib/permissions';

class Show extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    deleting: false
  }

  render() {
    return (
      <DocumentTitle title={this.props.pipelineSchedule.cronline}>
        <PageWithContainer>
          <PageHeader>
            <PageHeader.Title>{this.props.pipelineSchedule.cronline}</PageHeader.Title>
            <PageHeader.Description><Emojify text={this.props.pipelineSchedule.description || "No description"} /></PageHeader.Description>
            <PageHeader.Menu>{this.renderMenu()}</PageHeader.Menu>
          </PageHeader>

          <Panel className="mb4">
            <Panel.Header>Setup</Panel.Header>
            <Panel.Section>
              awesome
            </Panel.Section>
          </Panel>

          <Panel>
            <Panel.Header>Builds</Panel.Header>
            <Panel.Section>
              awesome
            </Panel.Section>
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderMenu() {
    return permissions(this.props.pipelineSchedule.permissions).collect(
      {
        allowed: "pipelineScheduleUpdate",
        render: (idx) => (
          <PageHeader.Button key={idx} link={`#`}>Edit</PageHeader.Button>
        )
      },
      {
        allowed: "pipelineScheduleDelete",
        render: (idx) => (
          <PageHeader.Button key={idx} loading={this.state.deleting ? "Deleting…" : false} onClick={this.handleScheduleDeleteClick}>Delete</PageHeader.Button>
        )
      }
    )
  }

  handleScheduleDeleteClick = () => {
    if(confirm("Delete this schedule?")) {
      this.setState({ deleting: true });

      var mutation = new PipelineScheduleDeleteMutation({
        pipelineSchedule: this.props.pipelineSchedule
      });

      Relay.Store.commitUpdate(mutation, {
        onSuccess: this.handleDeleteMutationSuccess,
        onFailure: this.handleDeleteMutationFailure
      });
    }
  }

  handleDeleteMutationSuccess = (response) => {
    this.context.router.push(`/${this.props.params.organization}/${this.props.params.pipeline}/settings/schedules`);
  }

  handleDeleteMutationFailure = (transaction) => {
    this.setState({ deleting: false });

    alert(transaction.getError());
  }
}

export default Relay.createContainer(Show, {
  fragments: {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        ${PipelineScheduleDeleteMutation.getFragment('pipelineSchedule')}
        cronline
        description
        permissions {
          pipelineScheduleUpdate {
            allowed
          }
          pipelineScheduleDelete {
            allowed
          }
        }
        builds(first: 5) {
          edges {
            node {
              url
            }
          }
        }
      }
    `
  }
});
