import React from 'react';
import PusherStore from '../stores/PusherStore';

class OrganizationAgentsBadge extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      agents: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    }),
    className: React.PropTypes.string
  };

  state = { count: this.props.organization.agents.count };

  componentDidMount() {
    PusherStore.on("organization_stats:change", this._onStoreChange.bind(this));
  }

  componentWillUnmount() {
    PusherStore.off("organization_stats:change", this._onStoreChange.bind(this));
  }

  render() {
    return (
      <span className={this.props.className}>{this.state.count}</span>
    );
  }

  _onStoreChange(payload) {
    this.setState({ count: payload.agentsConnectedCount });
  }
}

export default OrganizationAgentsBadge;
