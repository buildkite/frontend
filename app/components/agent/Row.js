import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import classNames from 'classnames';

import Panel from '../shared/Panel';

class AgentRow extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      connectionState: React.PropTypes.string.isRequired,
      hostname: React.PropTypes.string.isRequired,
      metaData: React.PropTypes.array.isRequired,
      name: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired
      }).isRequired,
      uuid: React.PropTypes.string.isRequired,
      version: React.PropTypes.string.isRequired
    })
  };

  render() {
    const iconClassName = classNames('circle', {
      'bg-lime': this.props.agent.connectionState === 'connected',
      'bg-gray': this.props.agent.connectionState === 'disconnected' || this.props.agent.connectionState === 'never_connected',
      'bg-orange': this.props.agent.connectionState !== 'connected' && this.props.agent.connectionState !== 'disconnected' && this.props.agent.connectionState !== 'never_connected'
    });

    let metaDataContent = 'No metadata';
    if (this.props.agent.metaData.length > 0) {
      metaDataContent = this.props.agent.metaData.sort().join(' ');
    }

    return (
      <Panel.Row>
        <div className="flex">
          <div className="pr3 pt1">
            <div className={iconClassName} style={{ width: 12, height: 12 }} />
          </div>
          <div className="flex-auto">
            <div><Link to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}`}>{this.props.agent.name}</Link></div>
            <small className="dark-gray">{metaDataContent}</small>
          </div>
          <div className="right-align">
            <div className="black">v{this.props.agent.version}</div>
            <small className="dark-gray">{this.props.agent.hostname}</small>
          </div>
        </div>
      </Panel.Row>
    );
  }
}

export default Relay.createContainer(AgentRow, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        id
        connectionState
        hostname
        metaData
        name
        organization {
          slug
        }
        uuid
        version
      }
    `
  }
});
