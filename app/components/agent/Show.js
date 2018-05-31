import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';
import { seconds } from 'metrick/duration';

import AgentStateIcon from './state-icon';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import FlashesStore from '../../stores/FlashesStore';
import FriendlyTime from '../shared/FriendlyTime';
import JobLink from '../shared/JobLink';
import JobState from '../icons/JobState';
import PageWithContainer from '../shared/PageWithContainer';
import Panel from '../shared/Panel';
import permissions from '../../lib/permissions';
import { getLabelForConnectionState } from './shared';

import { formatNumber } from '../../lib/number';

import AgentStopMutation from '../../mutations/AgentStop';

const ExtrasTable = styled.table`
  @media (max-width: 720px) {
    &, tbody {
      display: block;
    }

    tr {
      display: flex;
    }

    th {
      padding-bottom: 0;
    }
  }
`;

class AgentShow extends React.Component {
  static propTypes = {
    agent: PropTypes.shape({
      uuid: PropTypes.string,
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
      }),
      public: PropTypes.bool.isRequired
    }),
    relay: PropTypes.object.isRequired
  };

  state = {
    stopping: false
  };

  componentDidMount() {
    // Only bother setting up the delayed load and refresher if we've got an
    // actual agent to play with.
    if (this.props.agent && this.props.agent.uuid) {
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

  renderJob(job) {
    if (!job) {
      return 'A job owned by another team';
    }

    return (
      <span style={{ display: 'inline-block', marginLeft: '1.4em' }}>
        <JobState.XSmall
          job={job}
          style={{ marginLeft: '-1.4em', marginRight: '.4em' }}
        />
        <JobLink job={job} />
      </span>
    );
  }

  renderExtraItem(title, content) {
    return (
      <tr key={title} style={{ marginTop: 3 }} className="border-gray border-bottom flex-wrap">
        <th className="h4 p2 semi-bold left-align align-top" width={120}>{title}</th>
        <td className="h4 p2" style={{ flexGrow: 1 }}>{content}</td>
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

    extras.push(this.renderExtraItem('Version', agent.version || 'Unknown'));

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

    extras.push(this.renderExtraItem(
      <Link
        to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}/jobs`}
        className="blue hover-navy text-decoration-none hover-underline"
      >
        Jobs
      </Link>,
      this.renderExtraJobs(agent)
    ));

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

    return (
      <ExtrasTable className="col-12">
        <tbody>
          {extras}
        </tbody>
      </ExtrasTable>
    );
  }

  renderExtraJobs(agent) {
    if (agent.jobs.edges.length < 1) {
      return 'This agent has not run any jobs';
    }

    let content = (
      <ul className="m0 list-reset">
        {
          agent.jobs.edges.map(({ node: job }) => (
            <li key={job.uuid}>
              {this.renderJob(job)}
            </li>
          ))
        }
      </ul>
    );

    const remainder = agent.jobs.count - agent.jobs.edges.length;

    if (remainder) {
      content = (
        <div>
          {content}
          <Link
            to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}/jobs`}
            className="blue hover-navy text-decoration-none hover-underline"
          >
            (and {formatNumber(remainder)} more)
          </Link>
        </div>
      );
    }

    return content;
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
    if (!this.props.agent || !this.props.agent.uuid) {
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
            <Panel.Header>
              {this.props.agent.name}
              {this.renderPublicBadge()}
            </Panel.Header>

            <Panel.Row key="info">
              {this.renderExtras(agent)}
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

  renderPublicBadge() {
    if (this.props.agent.public) {
      return (
        <Badge outline={true} className="regular bg-white" title="Visible to everyone, including people outside this organization">Public</Badge>
      );
    }
  }
}

export default Relay.createContainer(AgentShow, {
  initialVariables: {
    jobPageSize: 10
  },

  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        ${AgentStateIcon.getFragment('agent')}
        ${AgentStopMutation.getFragment('agent')}
        uuid
        name
        organization {
          name
          slug
        }
        connectedAt
        connectionState
        disconnectedAt
        hostname
        ipAddress
        job {
          ...on JobTypeCommand {
            state
            passed
          }
          ${JobLink.getFragment('job')}
        }
        jobs(first: $jobPageSize) {
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
          count
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
        public
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
