import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import { Link } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';
import { seconds } from 'metrick/duration';

import AgentStateIcon from './state-icon';
import Badge from 'app/components/shared/Badge';
import Button from 'app/components/shared/Button';
import FlashesStore from 'app/stores/FlashesStore';
import FriendlyTime from 'app/components/shared/FriendlyTime';
import JobLink from 'app/components/shared/JobLink';
import JobState from 'app/components/icons/JobState';
import PageWithContainer from 'app/components/shared/PageWithContainer';
import Panel from 'app/components/shared/Panel';
import permissions from 'app/lib/permissions';
import { getLabelForConnectionState } from './shared';

import { formatNumber } from 'app/lib/number';

import AgentStopMutation from 'app/mutations/AgentStop';

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
      disconnectedAt: PropTypes.string,
      stoppedAt: PropTypes.string,
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
    stopping: false,
    forceStopping: false
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

  renderExtraItem(title, content, options) {
    return (
      <tr key={title} style={{ marginTop: 3 }} className={`${(!options || options.borderBottom !== false) && 'border-gray border-bottom'} flex-wrap`}>
        <th className="h4 p2 semi-bold left-align align-top" width={120}>{title}</th>
        <td className="h4 p2" style={{ flexGrow: 1 }}>{content}</td>
      </tr>
    );
  }

  renderExtras(agent) {
    const extras = [];

    extras.push(this.renderExtraItem('State', (
      <div>
        <AgentStateIcon agent={agent} style={{ marginRight: '.4em' }} />
        {getLabelForConnectionState(agent.connectionState)}
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
        <FriendlyTime value={agent.connectedAt} />
      ));

      if (agent.pingedAt) {
        extras.push(this.renderExtraItem(
          'Last Ping',
          <FriendlyTime value={agent.pingedAt} />
        ));
      }
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
        'Stopped By',
        <span>
          {agent.stoppedBy.name} <FriendlyTime value={agent.stoppedAt} capitalized={false} />
        </span>
      ));

      if (agent.disconnectedAt) {
        extras.push(this.renderExtraItem(
          'Disconnected',
          <FriendlyTime value={agent.disconnectedAt} />
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
      'Tags',
      <pre className="black bg-silver rounded border border-gray p2 m0 mb1 monospace" style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{metaDataContent}</pre>,
      { borderBottom: false }
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

    this.setState({ stopping: true }, () => {
      // We add a delay in case it executes so quickly that the user can't
      // understand what just flashed past their face.
      setTimeout(() => {
        this.sendAgentStopMutation(true, this.handleStopMutationSuccess, this.handleStopMutationError);
      }, 1250);
    });
  }

  handleForceStopButtonClick = (evt) => {
    evt.preventDefault();

    this.setState({ forceStopping: true }, () => {
      this.sendAgentStopMutation(false, this.handleForceStopMutationSuccess, this.handleForceStopMutationError);
    });
  }

  sendAgentStopMutation = (graceful, onSuccess, onFailure) => {
    Relay.Store.commitUpdate(
      new AgentStopMutation({
        agent: this.props.agent,
        graceful
      }),
      { onSuccess, onFailure }
    );
  };

  handleStopMutationSuccess = () => {
    this.setState({ stopping: false });
  };

  handleStopMutationError = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());

    this.setState({ stopping: false });
  };

  handleForceStopMutationSuccess = () => {
    // Force stopping state stays on, because it doesn't change the connectionState
  };

  handleForceStopMutationError = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());

    this.setState({ forceStopping: false });
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
              {(this.props.agent.connectionState === 'connected' || this.props.agent.connectionState === 'stopping') &&
                <p className="m0">
                  You can use the agent’s tags to target the agent in your pipeline’s step configuration, or to set the agent’s queue.
                  See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/v3/cli-start">Agent Tags and Queue Documentation</a> for more details.
                </p>
              }
            </Panel.Row>

            {this.renderStopRow()}
            {this.renderForceStopRow()}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderStopRow() {
    if (this.props.agent.disconnectedAt !== null) {
      return null;
    }
    if (this.props.agent.connectionState === 'stopped') {
      return null;
    }
    if (!permissions(this.props.agent.permissions).isPermissionAllowed("agentStop")) {
      return null;
    }

    const stopping = this.state.stopping || this.props.agent.connectionState === 'stopping';

    return (
      <Panel.Row>
        <div className="flex items-center">
          <Button
            theme="default"
            outline={true}
            loading={stopping ? "Stopping…" : false}
            onClick={this.handleStopButtonClick}
            className="mb1 mr3 flex-none"
          >
            Stop Agent
          </Button>
          <p className="dark-gray m0 flex-1">
            {!this.props.agent.job && !this.props.agent.stoppedAt && 'Send a signal to the agent that it should disconnect.'}
            {this.props.agent.job && !this.props.agent.stoppedAt && 'Send a signal to the agent that it should disconnect once its current job has completed.'}
            {this.props.agent.job && this.props.agent.stoppedAt && 'Waiting for the agent to complete its current job and disconnect.'}
            {!this.props.agent.job && this.props.agent.stoppedAt && 'Waiting for the agent to disconnect.'}
            {!this.props.agent.job && this.props.agent.stoppedAt && moment().diff(this.props.agent.stoppedAt, 'seconds') > 5 && ' If the agent doesn’t respond within a few minutes, it will be forcefully removed from your agent pool.'}
          </p>
        </div>
      </Panel.Row>
    );
  }

  renderForceStopRow() {
    if (this.state.stopping || this.props.agent.connectionState !== 'stopping') {
      return null;
    }

    if (this.props.agent.stoppedAt && moment().diff(this.props.agent.stoppedAt, 'seconds') < 5) {
      return null;
    }

    // if the user can't stop an agent, abort
    if (!permissions(this.props.agent.permissions).isPermissionAllowed("agentStop")) {
      return null;
    }

    return (
      <Panel.Row>
        <div className="flex items-center">
          <Button
            theme="default"
            outline={true}
            loading={this.state.forceStopping ? "Force Stopping…" : false}
            onClick={this.handleForceStopButtonClick}
            className="mb1 mr3 flex-none"
          >
            Force Stop Agent
          </Button>
          <p className="dark-gray m0 flex-1">
            {!this.props.agent.job && !this.state.forceStopping && 'Forcefully remove this agent from your agent pool.'}
            {this.props.agent.job && 'Cancel the running job, and forcefully remove this agent from your agent pool.'}
          </p>
        </div>
      </Panel.Row>
    );
  }

  renderPublicBadge() {
    if (this.props.agent.public) {
      return (
        <Badge outline={true} className="regular bg-white" title="Visible to everyone, including people outside this organization">Public</Badge>
      );
    }
  }
}

/*
Disabling graphql/no-deprecated-fields here as I think there is some changes probably
required in the graph implementation so that we can actually use the alternatives to
`pingedAt`, `stoppedAt`, & `stoppedBy` fields as at the moment it seems like using these
fields will mean we need do a lot of extra fetching and checking on the client which
seems bad?
*/
/* eslint-disable graphql/no-deprecated-fields */
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
