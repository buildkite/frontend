import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import classNames from 'classnames';

import Panel from '../shared/Panel';
import PageWithContainer from '../shared/PageWithContainer';
import RevealButton from '../shared/RevealButton';

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      agents: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      }).isRequired,
      permissions: React.PropTypes.shape({
        agentTokenView: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      }).isRequired,
      agentTokens: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    const tokenViewAllowed = this.props.organization.permissions.agentTokenView.allowed;
    const agentTokens = this.props.organization.agentTokens.edges;

    let pageContent = (
      <Panel>
        <Panel.Header>Agents</Panel.Header>
        {this.renderAgentList()}
      </Panel>
    );

    if (tokenViewAllowed && agentTokens.length) {
      pageContent = (
        <div className="clearfix mxn3">
          <div className="sm-col sm-col-8 px3">
            {pageContent}
          </div>
          <div className="sm-col sm-col-4 px3">
            <Panel>
              <Panel.Header>Agent Token</Panel.Header>
              <Panel.Row>
                <p className={classNames("black", { [agentTokens.length === 1 ? 'mt0' : 'm0']: true })}>Your Buildkite agent token is used to configure and start new Buildkite agents.</p>
                {agentTokens.length === 1 &&
                  <RevealButton caption="Reveal Agent Token">
                    <code className="red monospace" style={{ wordWrap: "break-word" }}>{agentTokens[0].node.token}</code>
                  </RevealButton>
                }
              </Panel.Row>
              {agentTokens.length > 1 &&
                <Panel.Row>
                  {agentTokens.map((token, index, array) => (
                    <div key={index}>
                      <small className="dark-gray">{token.node.description}</small><br />
                      <RevealButton caption="Reveal Agent Token">
                        <code className="red monospace" style={{ wordWrap: "break-word" }}>{token.node.token}</code>
                      </RevealButton>
                      {index !== array.length - 1 && <hr className="bg-gray mx-auto max-width-1 border-none height-0" style={{ height: 1 }} />}
                    </div>
                  ))}
                </Panel.Row>
              }
            </Panel>
          </div>
        </div>
      );
    }

    return (
      <DocumentTitle title={`Agents · ${this.props.organization.name}`}>
        <PageWithContainer>
          {pageContent}
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
        permissions {
          agentTokenView {
            allowed
          }
        }
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
        agentTokens(first:500, revoked:false) {
          edges {
            node {
              description
              token
            }
          }
        }
      }
    `
  }
});
