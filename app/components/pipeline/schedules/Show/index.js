import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PipelineScheduleDeleteMutation from '../../../../mutations/PipelineScheduleDelete';

import PageHeader from '../../../shared/PageHeader';
import Panel from '../../../shared/Panel';
import Emojify from '../../../shared/Emojify';

import permissions from '../../../../lib/permissions';
import { getRelativeDateString } from '../../../../lib/date';

import Build from './build';

class Show extends React.Component {
  static propTypes = {
    pipelineSchedule: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      cronline: PropTypes.string.isRequired,
      label: PropTypes.string,
      commit: PropTypes.string,
      branch: PropTypes.string,
      message: PropTypes.string,
      env: PropTypes.arrayOf(PropTypes.string),
      nextBuildAt: PropTypes.string,
      pipeline: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        organization: PropTypes.shape({
          slug: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      builds: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired,
      createdBy: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      permissions: PropTypes.shape({
        pipelineScheduleUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        pipelineScheduleDelete: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    })
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    deleting: false
  }

  render() {
    // If the schedule doesn't exist, that means that it's just been deleted.
    // And since we require all the schedule to render this component, we'll
    // just short-circut the re-render when it's gone. This isn't great, maybe
    // there's a beter way?
    if (!this.props.pipelineSchedule) {
      return null;
    }

    return (
      <DocumentTitle title={this.props.pipelineSchedule.cronline}>
        <div>
          <PageHeader>
            <PageHeader.Title><Emojify text={this.props.pipelineSchedule.label || "No description"} /></PageHeader.Title>
            <PageHeader.Description>{this.props.pipelineSchedule.cronline}</PageHeader.Description>
            <PageHeader.Menu>{this.renderMenu()}</PageHeader.Menu>
          </PageHeader>

          <Panel className="mb4">
            <Panel.Section>
              <div><strong>Commit</strong></div>
              <div className="mb2 dark-gray"><code>{this.props.pipelineSchedule.commit}</code></div>

              <div><strong>Branch</strong></div>
              <div className="mb2 dark-gray">{this.props.pipelineSchedule.branch}</div>

              <div><strong>Message</strong></div>
              <div className="mb2 dark-gray">{this.props.pipelineSchedule.message || "Scheduled build"}</div>

              {this.renderEnv()}

              <div><strong>Created By</strong></div>
              <div className="mb2 dark-gray">{this.props.pipelineSchedule.createdBy.name}</div>
            </Panel.Section>
          </Panel>

          <Panel>
            <Panel.Header>Recent Builds</Panel.Header>
            <Panel.Row>
              <div className="dark-gray py1">
                <Emojify text={`Next build scheduled for ${getRelativeDateString(this.props.pipelineSchedule.nextBuildAt)}`} />
              </div>
            </Panel.Row>
            {this.props.pipelineSchedule.builds.edges.map((edge) => <Build key={edge.node.id} build={edge.node} />)}
          </Panel>
        </div>
      </DocumentTitle>
    );
  }

  renderEnv() {
    if (this.props.pipelineSchedule.env.length !== 0) {
      return (
        <div>
          <div><strong>Environment Variables</strong></div>
          <div className="mb2 dark-gray"><pre><code>{this.props.pipelineSchedule.env.join("\n")}</code></pre></div>
        </div>
      );
    }

    return null;
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
