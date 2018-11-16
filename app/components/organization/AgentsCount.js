// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import throttle from 'throttleit';
import PusherStore from 'app/stores/PusherStore';
import { formatNumber } from 'app/lib/number';
import type { RelayProp } from 'react-relay';
import type { AgentsCount_organization } from './__generated__/AgentsCount_organization.graphql';

type Props = {
  organization: AgentsCount_organization,
  relay: RelayProp
};

type State = {
  agentCount: number
};

// We need a `requestUpdate` queue above the React component level so
// AgentsCount components will only perform one `forceFetch` in any
// given time window. I wish this was cleaner, kid, I really do.
const requestUpdate = throttle((callback) => callback(), 3);

class AgentsCount extends React.Component<Props, State> {
  state = {
    agentCount: this.props.organization.agents ? this.props.organization.agents.count : 0
  };

  componentDidMount() {
    PusherStore.on('organization_stats:change', this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off('organization_stats:change', this.handlePusherWebsocketEvent);
  }

  // Like in MyBuilds, we don't take the Pusher data for granted - we instead
  // take it as a cue to update the data store backing the component.
  handlePusherWebsocketEvent = ({ agentsConnectedCount }) => {
    // We need a "global" last agents connected count so we only ask it to update
    // once per changed count. This prevents calls from multiple AgentsCount
    // components triggering repeated forceFetch calls for one Pusher event
    //
    // $FlowExpectError
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

  render() {
    return (
      <span>
        {formatNumber(this.state.agentCount)}
      </span>
    );
  }
}

export default createFragmentContainer(
  AgentsCount,
  graphql`
    fragment AgentsCount_organization on Organization {
      agents {
        count
      }
    }
  `
);