import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import PusherStore from '../../stores/PusherStore';

import { formatNumber } from '../../lib/number';

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
    PusherStore.on("organization_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("organization_stats:change", this.handlePusherWebsocketEvent);
  }

  // Like in MyBuilds, we don't take the Pusher data for granted - we instead
  // take it as a cue to update the data store backing the component.
  handlePusherWebsocketEvent = (payload) => {
    if (this.state.agentCount !== payload.agentsConnectedCount) {
      this.props.relay.forceFetch();
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
