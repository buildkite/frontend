import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';

import AgentRow from './Row';

import Panel from '../shared/Panel';
import PageWithContainer from '../shared/PageWithContainer';
import RevealButton from '../shared/RevealButton';
import Button from '../shared/Button';

const AGENT_LIST_REFRESH_INTERVAL = 10 * 1000;
const PAGE_SIZE = 20;

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      agents: React.PropTypes.shape({
        pageInfo: React.PropTypes.shape({
          hasNextPage: React.PropTypes.bool.isRequired
        }).isRequired,
        count: React.PropTypes.integer.isRequired,
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
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this._agentListRefreshInterval = setInterval(this.fetchUpdatedData, AGENT_LIST_REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._agentListRefreshInterval);
  }

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(true);
  };

  render() {
    const tokenViewAllowed = this.props.organization.permissions.agentTokenView.allowed;
    const agentTokens = this.props.organization.agentTokens.edges;

    let loadMoreButton;
    if (this.props.organization.agents.pageInfo.hasNextPage) {
      loadMoreButton =
        <Button outline={true} theme={"default"} onClick={this.handleLoadMoreAgentsClick}>Load {PAGE_SIZE} more agents...</Button>;
    } else {
      loadMoreButton = <small className="dark-gray">No more to load</small>;
    }

    let pageContent = (
      <Panel>
        <Panel.Header>Agents (Showing {this.props.organization.agents.edges.length} of {this.props.organization.agents.count})</Panel.Header>
        {this.renderAgentList(this.props.organization.agents)}
        <Panel.Footer>
          {loadMoreButton}
        </Panel.Footer>
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
                      <small className="dark-gray mb1 block">{token.node.description}</small>
                      <RevealButton caption="Reveal Agent Token">
                        <code className="red monospace" style={{ wordWrap: "break-word" }}>{token.node.token}</code>
                      </RevealButton>
                      {index !== array.length - 1 && <hr className="bg-gray mx-auto max-width-1 border-none height-0 my3" style={{ height: 1 }} />}
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

  renderAgentList(agents) {
    if (agents.edges.length > 0) {
      return agents.edges.map((edge) => <AgentRow key={edge.node.id} agent={edge.node} />);
    } else {
      return <Panel.Section className="dark-gray">No agents connected</Panel.Section>;
    }
  }

  handleLoadMoreAgentsClick = () => {
    this.props.relay.setVariables({
      pageSize: this.props.relay.variables.pageSize + PAGE_SIZE
    });
  };
}

export default Relay.createContainer(AgentIndex, {
  initialVariables: {
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        permissions {
          agentTokenView {
            allowed
          }
        }
        agents(first: $pageSize) {
          count
          edges {
            node {
              id
              ${AgentRow.getFragment('agent')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
        agentTokens(first: 500, revoked:false) {
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
