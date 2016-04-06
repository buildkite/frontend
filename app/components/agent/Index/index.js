import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithCenterContent from '../../shared/PageWithCenterContent';
import Panel from '../../shared/Panel'
import Button from '../../shared/Button'

import Agent from './agent';

class Index extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      agents: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Agents · ${this.props.organization.name}`}>
        <PageWithCenterContent>
          <Panel>
            <Panel.Header>Agents</Panel.Header>
            {this.props.organization.agents.edges.map((edge) => <Agent key={edge.node.id} agent={edge.node} />)}
          </Panel>
        </PageWithCenterContent>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        agents(first: 100) {
          edges {
            node {
              id
              ${Agent.getFragment('agent')}
            }
          }
        }
      }
    `
  }
});
