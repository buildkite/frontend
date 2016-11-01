import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import AgentRow from './row';

const AGENT_LIST_REFRESH_INTERVAL = 10 * 1000;
const PAGE_SIZE = 20;

class Agents extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      agents: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        pageInfo: React.PropTypes.shape({
          hasNextPage: React.PropTypes.bool.isRequired
        }).isRequired,
        edges: React.PropTypes.array.isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this._agentListRefreshInterval = setInterval(this.fetchUpdatedData, AGENT_LIST_REFRESH_INTERVAL);
    this.props.relay.setVariables({ isMounted: true });
  }

  componentWillUnmount() {
    clearInterval(this._agentListRefreshInterval);
  }

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(true);
  };

  render() {
    return (
      <Panel>
        <Panel.Header>Agents {this.renderHeaderInformation()}</Panel.Header>
        {this.renderRows()}
        {this.renderLoadMoreButton()}
      </Panel>
    );
  }

  renderHeaderInformation() {
    if (this.props.organization.agents) {
      return (
        <span>(Showing {this.props.organization.agents.edges.length} of {this.props.organization.agents.count})</span>
      );
    }
  }

  renderRows() {
    const agents = this.props.organization.agents;

    if (agents) {
      if (agents.edges.length > 0) {
        return agents.edges.map((edge) => <AgentRow key={edge.node.id} agent={edge.node} />);
      } else {
        return <Panel.Section className="dark-gray">No agents connected</Panel.Section>;
      }
    } else {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }
  }

  renderLoadMoreButton() {
    if (this.props.organization.agents) {
      if (this.props.organization.agents.pageInfo.hasNextPage) {
        return (
          <Panel.Footer>
            <Button outline={true} theme={"default"} onClick={this.handleLoadMoreAgentsClick}>Load {PAGE_SIZE} more agents…</Button>
          </Panel.Footer>
        );
      } else {
        return (
          <Panel.Footer>
            <small className="dark-gray">No more to load</small>
          </Panel.Footer>
        );
      }
    }
  }

  handleLoadMoreAgentsClick = () => {
    this.props.relay.setVariables({
      pageSize: this.props.relay.variables.pageSize + PAGE_SIZE
    });
  };
}

export default Relay.createContainer(Agents, {
  initialVariables: {
    isMounted: false,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        agents(first: $pageSize) @include(if: $isMounted) {
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
      }
    `
  }
});
