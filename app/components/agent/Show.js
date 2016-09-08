import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';

import Emojify from '../shared/Emojify';
import Panel from '../shared/Panel';
import PageWithContainer from '../shared/PageWithContainer';
import FriendlyTime from "../shared/FriendlyTime";

class AgentShow extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      connectionState: React.PropTypes.string.isRequired
    })
  };

  getConnectionStateLabel(state) {
    return {
      'connected': 'Connected',
      'disconnected': 'Disconnected',
      'never_connected': 'Never Connected',
      'lost': 'Lost Connection',
      'stopped': 'Stopped',
      'stopping': 'Stopping…'
    }[state];
  }

  renderExtraItem(title, content) {
    return (
      <li key={title}><strong className="black">{title}:</strong> {content}</li>
    );
  }

  renderExtras(agent) {
    if (agent.hosted) {
      return 'Hosted by Buildkite';
    }

    const extras = [];

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
      extras.push(this.renderExtraItem('OS', agent.operatingSystem));
    }

    if (agent.priority) {
      extras.push(this.renderExtraItem('Priority', agent.priority));
    }

    if (agent.job) {
      extras.push(this.renderExtraItem('Running', <a href="agent.job.path">{agent.job.projectName} - Build {agent.job.buildNumber} / <Emojify>{agent.job.name || agent.job.command}</Emojify></a>));
    }

    if (agent.connectedAt) {
      extras.push(this.renderExtraItem(
        'Connected',
        <span>
          <FriendlyTime value={agent.connectedAt} capitalized={true} />
          {agent.pingedAt && agent.connectionState === 'connected' &&
            <span> (last check-in was {<FriendlyTime value={agent.pingedAt} />})</span>
          }
        </span>
      ));
    }

    if (agent.connectionState === 'disconnected') {
      extras.push(this.renderExtraItem('Disconnected', <FriendlyTime value={agent.disconnectedAt} />));
    } else if (agent.connectionState === 'lost') {
      extras.push(this.renderExtraItem('Lost', <FriendlyTime value={agent.lostAt} />));
    } else if (agent.connectionState === 'stopped' || agent.connectionState === 'stopping') {
      extras.push(this.renderExtraItem('Stopped', <span><FriendlyTime value={agent.stoppedAt} /> by {agent.stoppedBy}</span>));

      // Also show when the agent eventually disconnected
      if (agent.disconnectedAt) {
        extras.push(this.renderExtraItem('Disconnected', <FriendlyTime value={agent.disconnectedAt} />));
      }
    }

    return extras;
  }

  render() {
    const agent = this.props.agent;

    const connectionStateClassName = classNames({
      'lime': agent.connectionState === 'connected',
      'gray': agent.connectionState === 'disconnected' || agent.connectionState === 'never_connected',
      'orange': agent.connectionState !== 'connected' && agent.connectionState !== 'disconnected' && this.props.agent.connectionState !== 'never_connected'
    });

    let metaDataContent = 'None';
    if (agent.metaData) {
      metaDataContent = agent.metaData.join('\n');
    }

    return (
      <DocumentTitle title={`Agents / ${agent.name} · ${agent.organization.name}`}>
        <PageWithContainer>
          <Panel>
            <Panel.Header>{agent.name}</Panel.Header>
            <Panel.Row>
              <div className="left right-align sm-col-3 p2">
                Status
              </div>
              <div className="left sm-col-9 p2">
                <strong className={connectionStateClassName}>{this.getConnectionStateLabel(agent.connectionState)}</strong><br/>
                <small className="dark-gray">
                  <ul className="list-reset m0">
                    {this.renderExtras(agent)}
                  </ul>
                </small>
              </div>
            </Panel.Row>
            <Panel.Row>
              <div className="left right-align sm-col-3 p2">
                Meta Data
              </div>
              <div className="left sm-col-9 p2">
                <pre>{metaDataContent}</pre>
                <small className="dark-gray">You can use the agent’s meta-data to target the agent in your pipeline’s step configuration, or to set the agent’s queue. See the <a href="/docs/agent/agent-meta-data">Agent Meta-data Documentation</a> and <a href="/docs/agent/queues">Agent Queues Documentation</a> for more details.</small>
              </div>
            </Panel.Row>
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(AgentShow, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        connectedAt
        connectionState
        disconnectedAt
        hostname
        ipAddress
        job
        lostAt
        name
        metaData
        operatingSystem
        organization {
          name
          slug
        }
        pid
        pingedAt
        stoppedAt
        stoppedBy
        userAgent
        uuid
        version
      }
    `
  }
});
