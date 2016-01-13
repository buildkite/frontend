import React from 'react';
import PusherStore from '../stores/PusherStore';

class OrganizationAgentsBadge extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      agents_connected_count: React.PropTypes.number.isRequired
    }),
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = { count: this.props.organization.agents_connected_count || 0 };
  }

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
    this.setState({ count: payload.agents_connected_count });
  }
}

export default OrganizationAgentsBadge;
