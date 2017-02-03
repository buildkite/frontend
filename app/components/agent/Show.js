import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import { seconds } from 'metrick/duration';

import Button from '../shared/Button';
import FlashesStore from '../../stores/FlashesStore';
import FriendlyTime from "../shared/FriendlyTime";
import JobLink from '../shared/JobLink';
import PageWithContainer from '../shared/PageWithContainer';
import Panel from '../shared/Panel';
import Spinner from '../shared/Spinner';
import permissions from '../../lib/permissions';
import { getColourForConnectionState, getLabelForConnectionState } from './shared';

import AgentStopMutation from '../../mutations/AgentStop';

class AgentShow extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      connectionState: React.PropTypes.string,
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
      this._agentRefreshInterval = setInterval(this.fetchUpdatedData, 5::seconds);

      // Once the agent's show page has mounted in DOM, switch `isMounted` to
      // true which will trigger a load of all the additional information we need
      // to show this page.
      this.props.relay.setVariables({ isMounted: true });
    }
  }

  componentWillUnmount() {
    if(this._agentRefreshInterval) {
      clearInterval(this._agentRefreshInterval);
    }
  }

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(true);
  };

  renderExtraItem(title, content) {
    return (
      <li key={title}>
        <strong className="black">{title}:</strong> {content}
      </li>
    );
  }

  renderExtras(agent) {
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

      // Also show when the agent eventually disconnected
      if (agent.disconnectedAt) {
        extras.push(this.renderExtraItem(
          'Disconnected',
          <FriendlyTime value={agent.disconnectedAt} />
        ));
      }
    }

    return extras;
  }

  handleStopButtonClick = (evt) => {
    evt.preventDefault();

    this.setState({ stopping: true });

    const mutation = new AgentStopMutation({
      agent: this.props.agent,
      graceful: false
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
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

    let contents;
    if (this.props.relay.variables.isMounted) {
      contents = this.renderContents();
    } else {
      contents = this.renderSpinner();
    }

    return (
      <DocumentTitle title={`Agents / ${this.props.agent.name} · ${this.props.agent.organization.name}`}>
        <PageWithContainer>
          <Panel>
            <Panel.Header>{this.props.agent.name}</Panel.Header>
            {contents}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderSpinner() {
    return (
      <Panel.Row>
        <div className="px3 py2 center">
          <Spinner />
        </div>
      </Panel.Row>
    );
  }

  renderContents() {
    const agent = this.props.agent;
    const connectionStateClassName = getColourForConnectionState(agent.connectionState);

    let metaDataContent = 'None';
    if (agent.metaData && agent.metaData.length) {
      metaDataContent = agent.metaData.sort().join('\n');
    }

    return [
      <Panel.Row key="info">
        <div className="sm-col sm-right-align sm-col-3 p2">
          Status
        </div>
        <div className="sm-col sm-col-9 p2">
          <strong className={connectionStateClassName}>
            {getLabelForConnectionState(agent.connectionState)}
          </strong>
          <br />
          <small className="dark-gray">
            <ul className="list-reset m0">
              {this.renderExtras(agent)}
            </ul>
          </small>
        </div>
      </Panel.Row>,

      <Panel.Row key="meta-data">
        <div className="sm-col sm-right-align sm-col-3 p2">
          Meta Data
        </div>
        <div className="left sm-col-9 p2">
          <pre className="black bg-silver rounded border border-gray p1 m0 monospace">{metaDataContent}</pre>
          <small className="dark-gray">
            You can use the agent’s meta-data to target the agent in your pipeline’s step configuration, or to set the agent’s queue.
            See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/agent-meta-data">Agent Meta-data Documentation</a> and <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/queues">Agent Queues Documentation</a> for more details.
          </small>
        </div>
      </Panel.Row>,

      this.renderStopRow()
    ];
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
            <div className="sm-col sm-right-align sm-col-3 p2 xs-hide" />
            <div className="sm-col sm-col-9 p2">
              <Button
                theme="default"
                outline={true}
                loading={this.state.stopping ? "Stopping…" : false}
                onClick={this.handleStopButtonClick}
              >
                Stop Agent
              </Button>
              <br />
              <small className="dark-gray">
                Remotely stop this agent process.
                Any running build job will be canceled.
              </small>
            </div>
          </Panel.Row>
        )
      }
    );
  }
}

// The $isMounted gear here is a little crappy. It should be nicer, but looks
// like there's a bug in grpahql-ruby at the moment:
// https://github.com/rmosolgo/graphql-ruby/issues/518

export default Relay.createContainer(AgentShow, {
  initialVariables: {
    isMounted: false
  },

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
        connectedAt @include(if: $isMounted)
        connectionState @include(if: $isMounted)
        disconnectedAt @include(if: $isMounted)
        hostname @include(if: $isMounted)
        id @include(if: $isMounted)
        ipAddress @include(if: $isMounted)
        job @include(if: $isMounted) {
          ${JobLink.getFragment('job')}
        }
        lostAt @include(if: $isMounted)
        metaData @include(if: $isMounted)
        operatingSystem @include(if: $isMounted)
        permissions @include(if: $isMounted) {
          agentStop {
            allowed
            code
            message
          }
        }
        pid @include(if: $isMounted)
        pingedAt @include(if: $isMounted)
        stoppedAt @include(if: $isMounted)
        stoppedBy @include(if: $isMounted) {
          name
        }
        userAgent @include(if: $isMounted)
        uuid @include(if: $isMounted)
        version @include(if: $isMounted)
      }
    `
  }
});
