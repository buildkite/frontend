import React from 'react';

import PusherStore from '../../stores/PusherStore';

class AgentsCount extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      agents: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    })
  };

  state = {
    agentCount: this.props.organization.agents ? this.props.organization.agents.count : 0
  };

  componentDidMount() {
    PusherStore.on("organization_stats:change", this.handleStoreChange);
  }

  componentWillUnmount() {
    PusherStore.off("organization_stats:change", this.handleStoreChange);
  }

  handleStoreChange = (payload) => {
    this.setState({ agentCount: payload.agentsConnectedCount });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.organization.agents) {
      this.setState({ agentCount: nextProps.organization.agents.count });
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { agentCount: lastAgentCount } = this.state;

    const { agentCount: newAgentCount } = nextState;
    const { agents: newAgents } = nextProps.organization;

    return (
      (newAgents && newAgents.count !== lastAgentCount)
      || (newAgentCount !== lastAgentCount)
    );
  };

  render() {
    return (
      <span>{this.state.agentCount}</span>
    );
  }
}

export default AgentsCount;
