import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';
import throttle from 'throttleit';
import { seconds } from 'metrick/duration';

import PusherStore from '../../stores/PusherStore';

import { formatNumber } from '../../lib/number';

// We need a `requestUpdate` queue above the React component level so
// AgentsCount components will only perform one `forceFetch` in any
// given time window. I wish this was cleaner, kid, I really do.
const requestUpdate = throttle((callback) => callback(), 3::seconds);

class AgentsCount extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      agents: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    }),
    relay: React.PropTypes.object.isRequired
  };

  state = {
    agentCount: this.props.organization.agents ? this.props.organization.agents.count : 0
  };

  componentDidMount() {
    console.debug('AgentsCount didMount');
    PusherStore.on('organization_stats:change', this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    console.debug('AgentsCount willUnmount');
    PusherStore.off('organization_stats:change', this.handlePusherWebsocketEvent);
  }

  // Like in MyBuilds, we don't take the Pusher data for granted - we instead
  // take it as a cue to update the data store backing the component.
  handlePusherWebsocketEvent = ({ agentsConnectedCount }) => {
    // We need a "global" last agents connected count so we only ask it to update
    // once per changed count. This prevents calls from multiple AgentsCount
    // components triggering repeated forceFetch calls for one Pusher event
    if (AgentsCount.lastAgentsConnectedCount !== agentsConnectedCount) {
      AgentsCount.lastAgentsConnectedCount = agentsConnectedCount;
      requestUpdate(() => this.props.relay.forceFetch());
    }
  };

  // Only once Relay comes back with an updated agentCount do we trust that data!
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.organization.agents) {
      this.setState({ agentCount: nextProps.organization.agents.count });
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return shallowCompare(this, nextProps, nextState);
  };

  render() {
    return (
      <span>
        {formatNumber(this.state.agentCount)}
      </span>
    );
  }
}

export default Relay.createContainer(AgentsCount, {
  fragments: {
    organization: () => Relay.QL`
        fragment on Organization {
          agents {
            count
          }
        }
      `
  }
});
