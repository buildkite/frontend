import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';
import { seconds } from 'metrick/duration';

import AgentStateIcon from './state-icon';
import BuildState from '../icons/BuildState';
import BuildStates from '../../constants/BuildStates';
import Button from '../shared/Button';
import FlashesStore from '../../stores/FlashesStore';
import FriendlyTime from '../shared/FriendlyTime';
import JobLink from '../shared/JobLink';
import PageWithContainer from '../shared/PageWithContainer';
import Panel from '../shared/Panel';
import permissions from '../../lib/permissions';
import { getLabelForConnectionState } from './shared';

import AgentStopMutation from '../../mutations/AgentStop';

class AgentShow extends React.Component {
  static propTypes = {
    agent: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      connectionState: PropTypes.string,
      job: PropTypes.object,
      permissions: PropTypes.shape({
        agentStop: PropTypes.shape({
          allowed: PropTypes.bool
        })
      }),
      organization: PropTypes.shape({
        name: PropTypes.string,
        slug: PropTypes.string
      })
    }),
    relay: PropTypes.object.isRequired
  };

  state = {
    stopping: false
  };

  componentDidMount() {
    // Only bother setting up the delayed load and refresher if we've got an
    // actual agent to play with.
    if (this.props.agent && this.props.agent.id) {
      // This will cause a full refresh of the data every 3 seconds. This seems
      // very low, but chances are people aren't really looking at this page
      // for long periods of time.
      this.startTimeout();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._agentRefreshTimeout);
  }

  startTimeout = () => {
    this._agentRefreshTimeout = setTimeout(
      this.fetchUpdatedData,
      3::seconds
    );
  };

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(
      true,
      (readyState) => {
        if (readyState.done) {
          this.startTimeout();
        }
      }
    );
  };

  getBuildStateForJob(job) {
    // Naïvely transliterate Job state to Build state
    switch (job.state) {
      case "FINISHED":
        return (
          job.passed
            ? BuildStates.PASSED
            : BuildStates.FAILED
        );
      case "PENDING":
      case "WAITING":
      case "UNBLOCKED":
      case "LIMITED":
      case "ASSIGNED":
      case "ACCEPTED":
        return BuildStates.SCHEDULED;
      case "TIMING_OUT":
      case "TIMED_OUT":
      case "WAITING_FAILED":
      case "BLOCKED_FAILED":
      case "UNBLOCKED_FAILED":
      case "BROKEN":
        return BuildStates.FAILED;
      default:
        return job.state;
    }
  }

  renderJob(job) {
    if (!job) {
      return 'A job owned by another team';
    }

    return (
      <span style={{ display: 'inline-block', marginLeft: '1.4em' }}>
        <BuildState.XSmall
          state={this.getBuildStateForJob(job)}
          style={{  marginLeft: '-1.4em', marginRight: '.4em' }}
        />
        <JobLink job={job} />
      </span>
    );
  }

  renderExtraItem(title, content) {
    return (
      <tr key={title} style={{ marginTop: 3 }} className="border-gray border-bottom">
        <th className="h4 p2 semi-bold left-align align-top" width={120}>{title}</th>
        <td className="h4 p2">{content}</td>
      </tr>
    );
  }

  renderExtras(agent) {
    const extras = [];

    let extraStoppingInfo;
    if (agent.connectionState === "stopping") {
      extraStoppingInfo = (
        <div className="dark-gray mt1">
          If the agent doesn’t respond to the stop signal within a few minutes, Buildkite will forcefully disconnect the agent and remove it from your pool of agents.
        </div>
      );
    }

    extras.push(this.renderExtraItem('State', (
      <div>
        <AgentStateIcon agent={agent} style={{ marginRight: '.4em' }} />
        {getLabelForConnectionState(agent.connectionState)}
        {extraStoppingInfo}
      </div>
    )));

    if (agent.version) {
      extras.push(this.renderExtraItem('Version', agent.version));
    }

    if (agent.hostname) {
      extras.push(this.renderExtraItem('Hostname', agent.hostname));
    }

    if (agent.pid) {
      extras.push(this.renderExtraItem('PID', agent.pid));
    }

    if (agent.ipAddress) {
      extras.push(this.renderExtraItem('IP Address', agent.ipAddress));
    }

    if (agent.userAgent) {
      extras.push(this.renderExtraItem('User Agent', agent.userAgent));
    }

    if (agent.operatingSystem) {
      extras.push(this.renderExtraItem('OS', agent.operatingSystem.name));
    }

    if (agent.priority) {
      extras.push(this.renderExtraItem('Priority', agent.priority));
    }

    if (agent.isRunningJob) {
      extras.push(this.renderExtraItem(
        'Running',
        // if we have access to the job, show a link
        this.renderJob(agent.job)
      ));
    }

    if (agent.jobs.edges.length) {
      extras.push(this.renderExtraItem(
        'Recent Jobs',
        <ul className="m0 list-reset">
          {
            agent.jobs.edges.map(({ node: job }) => (
              <li key={job.uuid}>
                {this.renderJob(job)}
              </li>
            ))
          }
        </ul>
      ));
    }

    if (agent.connectedAt) {
      extras.push(this.renderExtraItem(
        'Connected',
        <span>
          <FriendlyTime value={agent.connectedAt} />
          {agent.pingedAt && agent.connectionState === 'connected' &&
            <span> (last check-in was <FriendlyTime value={agent.pingedAt} capitalized={false} />)</span>
          }
        </span>
      ));
    }

    if (agent.connectionState === 'disconnected') {
      extras.push(this.renderExtraItem(
        'Disconnected',
        <FriendlyTime value={agent.disconnectedAt} />
      ));
    } else if (agent.connectionState === 'lost') {
      extras.push(this.renderExtraItem(
        'Lost',
        <FriendlyTime value={agent.lostAt} />
      ));
    } else if (agent.connectionState === 'stopped' || agent.connectionState === 'stopping') {
      extras.push(this.renderExtraItem(
        'Stopped',
        <span>
          <FriendlyTime value={agent.stoppedAt} /> by {agent.stoppedBy.name}
        </span>
      ));

      if (agent.disconnectedAt) {
        extras.push(this.renderExtraItem(
          'Disconnected',
          <FriendlyTime value={agent.disconnectedAt} />
        ));
      } else {
        extras.push(this.renderExtraItem(
          'Disconnected',
          '-'
        ));
      }
    }

    let metaDataContent = 'None';

    if (agent.metaData && agent.metaData.length) {
      metaDataContent = agent.metaData.sort().map((metaData) => {
        return (
          <div className="mb1" key={metaData}>{metaData}</div>
        );
      });
    }
    extras.push(this.renderExtraItem(
      'Meta-data',
      <pre className="black bg-silver rounded border border-gray p2 m0 mb1 monospace" style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{metaDataContent}</pre>
    ));

    return extras;
  }

  handleStopButtonClick = (evt) => {
    evt.preventDefault();

    this.setState({ stopping: true });

    // We add a delay in case it executes so quickly that the user can't
    // understand what just flashed past their face.
    setTimeout(() => {
      const mutation = new AgentStopMutation({
        agent: this.props.agent,
        graceful: false
      });

      Relay.Store.commitUpdate(mutation, {
        onSuccess: this.handleMutationSuccess,
        onFailure: this.handleMutationError
      });
    }, 1250);
  };

  handleMutationSuccess = () => {
    this.setState({ stopping: false });
  };

  handleMutationError = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());

    this.setState({ stopping: false });
  };

  render() {
    // If we don't have an agent object, or we do but it doesn't have an id
    // (perhaps Relay gave us an object but it's empty) then we can safely
    // assume that it's a 404.
    if (!this.props.agent || !this.props.agent.id) {
      return (
        <DocumentTitle title={`Agents / No Agent Found`}>
          <PageWithContainer>
            <p>No agent could be found!</p>
          </PageWithContainer>
        </DocumentTitle>
      );
    }

    const agent = this.props.agent;

    return (
      <DocumentTitle title={`Agents / ${this.props.agent.name} · ${this.props.agent.organization.name}`}>
        <PageWithContainer>
          <Panel className="sm-col-9 lg-col-6 mx-auto">
            <Panel.Header>{this.props.agent.name}</Panel.Header>

            <Panel.Row key="info">
              <table className="col-12">
                <tbody>
                  {this.renderExtras(agent)}
                </tbody>
              </table>
              <p>
                You can use the agent’s meta-data to target the agent in your pipeline’s step configuration, or to set the agent’s queue.
                See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/agent-meta-data">Agent Meta-data Documentation</a> and <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/queues">Agent Queues Documentation</a> for more details.
              </p>
            </Panel.Row>

            {this.renderStopRow()}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderStopRow() {
    if (this.props.agent.connectionState !== 'connected') {
      return null;
    }

    return permissions(this.props.agent.permissions).collect(
      {
        allowed: "agentStop",
        render: (idx) => (
          <Panel.Row key={idx}>
            <Button
              theme="default"
              outline={true}
              loading={this.state.stopping ? "Stopping…" : false}
              onClick={this.handleStopButtonClick}
              className="mb1"
            >
              Stop Agent
            </Button>
            {this.renderStopWarningMessage()}
          </Panel.Row>
        )
      }
    );
  }

  renderStopWarningMessage() {
    if (this.props.agent.job) {
      return (
        <span className="dark-gray pl3">
          The running job will be canceled.
        </span>
      );
    }
  }
}

export default Relay.createContainer(AgentShow, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        ${AgentStateIcon.getFragment('agent')}
        ${AgentStopMutation.getFragment('agent')}
        id
        name
        organization {
          name
          slug
        }
        connectedAt
        connectionState
        disconnectedAt
        hostname
        id
        ipAddress
        job {
          ...on JobTypeCommand {
            state
            passed
          }
          ${JobLink.getFragment('job')}
        }
        jobs(first: 10) {
          edges {
            node {
              ...on JobTypeCommand {
                uuid
                state
                passed
              }
              ${JobLink.getFragment('job')}
            }
          }
        }
        isRunningJob
        lostAt
        metaData
        operatingSystem {
          name
        }
        priority
        permissions {
          agentStop {
            allowed
            code
            message
          }
        }
        pid
        pingedAt
        stoppedAt
        stoppedBy {
          name
        }
        userAgent
        uuid
        version
      }
    `
  }
});
