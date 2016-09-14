import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import classNames from 'classnames';

import Panel from '../shared/Panel';
import PageWithContainer from '../shared/PageWithContainer';

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      agents: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Agents · ${this.props.organization.name}`}>
        <PageWithContainer>
          <Panel>
            <Panel.Header>Agents</Panel.Header>
            {this.renderAgentList()}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderAgentList() {
    if (this.props.organization.agents.edges.length > 0) {
      return this.props.organization.agents.edges.map((edge) => {
        const iconClassName = classNames('circle', {
          'bg-lime': edge.node.connectionState === 'connected',
          'bg-gray': edge.node.connectionState === 'disconnected' || edge.node.connectionState === 'never_connected',
          'bg-orange': edge.node.connectionState !== 'connected' && edge.node.connectionState !== 'disconnected' && edge.node.connectionState !== 'never_connected'
        });

        let metaDataContent = 'No metadata';
        if (edge.node.metaData.length > 0) {
          metaDataContent = edge.node.metaData.sort().join(' ');
        }

        return (
          <Panel.Row key={edge.node.id}>
            <div className="flex">
              <div className="pr3 pt1">
                <div className={iconClassName} style={{ width: 12, height: 12 }} />
              </div>
              <div className="flex-auto">
                <div><Link to={`/organizations/${this.props.organization.slug}/agents/${edge.node.uuid}`}>{edge.node.name}</Link></div>
                <small className="dark-gray">{metaDataContent}</small>
              </div>
              <div className="right-align">
                <div className="black">v{edge.node.version}</div>
                <small className="dark-gray">{edge.node.hostname}</small>
              </div>
            </div>
          </Panel.Row>
        );
      });
    } else {
      return <Panel.Section className="dark-gray">No agents connected</Panel.Section>;
    }
  }
}

export default Relay.createContainer(AgentIndex, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        agents(first:500) {
          edges {
            node {
              id
              name
              connectionState
              hostname
              metaData
              version
              uuid
            }
          }
        }
      }
    `
  }
});
