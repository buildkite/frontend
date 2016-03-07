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
    count: this.props.organization.agents.count
  };

  componentDidMount() {
    PusherStore.on("organization_stats:change", this.handleStoreChange);
  }

  componentWillUnmount() {
    PusherStore.off("organization_stats:change", this.handleStoreChange);
  }

  render() {
    return (
      <span>{this.state.count}</span>
    );
  }

  handleStoreChange = (payload) => {
    this.setState({ count: payload.agentsConnectedCount });
  };
}

export default AgentsCount;
