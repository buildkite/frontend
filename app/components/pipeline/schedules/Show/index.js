import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PipelineScheduleDeleteMutation from '../../../../mutations/PipelineScheduleDelete';

import PageHeader from '../../../shared/PageHeader';
import Panel from '../../../shared/Panel';
import PageWithContainer from '../../../shared/PageWithContainer';
import Emojify from '../../../shared/Emojify';

import permissions from '../../../../lib/permissions';
import friendlyRelativeTime from '../../../../lib/friendlyRelativeTime';

import Build from './build';

class Show extends React.Component {
  static propTypes = {
    pipelineSchedule: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      cronline: React.PropTypes.string.isRequired,
      label: React.PropTypes.string,
      commit: React.PropTypes.string,
      branch: React.PropTypes.string,
      message: React.PropTypes.string,
      env: React.PropTypes.arrayOf(React.PropTypes.string),
      nextBuildAt: React.PropTypes.string,
      pipeline: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired,
        organization: React.PropTypes.shape({
          slug: React.PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      builds: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              id: React.PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired,
      createdBy: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired
      }).isRequired,
      permissions: React.PropTypes.shape({
        pipelineScheduleUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        pipelineScheduleDelete: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

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
            <PageHeader.Description><Emojify text={this.props.pipelineSchedule.label || "No label"} /></PageHeader.Description>
            <PageHeader.Menu>{this.renderMenu()}</PageHeader.Menu>
          </PageHeader>

          <Panel className="mb4">
            <Panel.Section>
              <div><strong>Commit</strong></div>
              <div className="mb2 dark-gray"><code>{this.props.pipelineSchedule.commit}</code></div>

              <div><strong>Branch</strong></div>
              <div className="mb2 dark-gray"><code>{this.props.pipelineSchedule.branch}</code></div>

              <div><strong>Message</strong></div>
              <div className="mb2 dark-gray">{this.props.pipelineSchedule.message || "n/a"}</div>

              <div><strong>Environment Variables</strong></div>
              <div className="mb2 dark-gray"><pre><code>{this.props.pipelineSchedule.env.join("\n")}</code></pre></div>

              <div><strong>Creator</strong></div>
              <div className="mb2 dark-gray">{this.props.pipelineSchedule.createdBy.name}</div>
            </Panel.Section>
          </Panel>

          <Panel>
            <Panel.Header>Recent Builds</Panel.Header>
            <Panel.Row>
              <div className="dark-gray py2 center">
                <Emojify text={`:timer_clock: Next build scheduled for ${friendlyRelativeTime(this.props.pipelineSchedule.nextBuildAt)}...`} />
              </div>
            </Panel.Row>
            {this.props.pipelineSchedule.builds.edges.map((edge) => <Build key={edge.node.id} build={edge.node} />)}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderMenu() {
    return permissions(this.props.pipelineSchedule.permissions).collect(
      {
        allowed: "pipelineScheduleUpdate",
        render: (idx) => {
          const pipeline = this.props.pipelineSchedule.pipeline;
          const organization = this.props.pipelineSchedule.pipeline.organization;

          return (
            <PageHeader.Button key={idx} link={`/${organization.slug}/${pipeline.slug}/settings/schedules/${this.props.pipelineSchedule.uuid}/edit`}>Edit</PageHeader.Button>
          );
        }
      },
      {
        allowed: "pipelineScheduleDelete",
        render: (idx) => (
          <PageHeader.Button key={idx} loading={this.state.deleting ? "Deleting…" : false} onClick={this.handleScheduleDeleteClick}>Delete</PageHeader.Button>
        )
      }
    );
  }

  handleScheduleDeleteClick = () => {
    if (confirm("Delete this schedule?")) {
      this.setState({ deleting: true });

      const mutation = new PipelineScheduleDeleteMutation({
        pipelineSchedule: this.props.pipelineSchedule
      });

      Relay.Store.commitUpdate(mutation, {
        onSuccess: this.handleDeleteMutationSuccess,
        onFailure: this.handleDeleteMutationFailure
      });
    }
  }

  handleDeleteMutationSuccess = () => {
    const pipeline = this.props.pipelineSchedule.pipeline;
    const organization = this.props.pipelineSchedule.pipeline.organization;

    this.context.router.push(`/${organization.slug}/${pipeline.slug}/settings/schedules`);
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
        uuid
        cronline
        label
        nextBuildAt
        commit
        branch
        message
        env
        createdBy {
          name
        }
        pipeline {
          slug
          organization {
            slug
          }
        }
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
              id
              ${Build.getFragment('build')}
            }
          }
        }
      }
    `
  }
});
