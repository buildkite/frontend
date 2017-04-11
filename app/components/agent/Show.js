import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import { seconds } from 'metrick/duration';

import StateIcon from './state-icon';
import Button from '../shared/Button';
import FlashesStore from '../../stores/FlashesStore';
import FriendlyTime from "../shared/FriendlyTime";
import JobLink from '../shared/JobLink';
import PageWithContainer from '../shared/PageWithContainer';
import Panel from '../shared/Panel';
import permissions from '../../lib/permissions';
import { getLabelForConnectionState } from './shared';

import AgentStopMutation from '../../mutations/AgentStop';

class AgentShow extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      connectionState: React.PropTypes.string,
      job: React.PropTypes.object,
      permissions: React.PropTypes.shape({
        agentStop: React.PropTypes.shape({
          allowed: React.PropTypes.bool
        })
      }),
      organization: React.PropTypes.shape({
        name: React.PropTypes.string,
        slug: React.PropTypes.string
      })
    }),
    relay: React.PropTypes.object.isRequired
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

  renderExtraItem(title, content) {
    return (
      <tr key={title} style={{ marginTop: 3 }} className="border-gray border-bottom">
        <th className="h4 p2 semi-bold left-align align-top" width={100}>{title}</th>
        <td className="h4 p2">{content}</td>
      </tr>
    );
  }

  renderExtras(agent) {
    const extras = [];

    extras.push(this.renderExtraItem('State', (
      <span>
        <StateIcon agent={agent} className="pr2" />
        {getLabelForConnectionState(agent.connectionState)}
      </span>
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

    if (agent.job) {
      extras.push(this.renderExtraItem('Running', <JobLink job={agent.job} />));
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
      metaDataContent = agent.metaData.sort().map((metaData, index) => {
        return (
          <div className="mb1" key={index}>{metaData}</div>
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
          ${JobLink.getFragment('job')}
        }
        lostAt
        metaData
        operatingSystem {
          name
        }
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
