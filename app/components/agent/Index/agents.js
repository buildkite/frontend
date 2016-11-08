import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';
import { formatNumber } from '../../../lib/number';

import AgentRow from './row';
import Search from './search';

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

  state = {
    searching: null
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
        <div className="bg-silver semi-bold">
          <div className="flex items-center">
            <div className="flex-auto py2 px3">Agents</div>
            <div className="mr3">
              <Search className="input py1 px2" placeholder="Search" style={{ fontSize: 12, lineHeight: 1.1, height: 30, width: 160 }} onSearch={this.handleSearch} />
            </div>
          </div>
        </div>
        {this.renderSearchResults()}
        {this.renderRows()}
        {this.renderLoadMoreButton()}
      </Panel>
    );
  }

  renderSearchResults() {
    if (this.props.organization.agents && this.props.relay.variables.search) {
      return (
        <div className="bg-silver semi-bold py2 px3">
          <small className="dark-gray">{formatNumber(this.props.organization.agents.count)} matching agents</small>
        </div>
      );
    }
  }

  renderRows() {
    const agents = this.props.organization.agents;

    if (!agents || this.state.searching) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    } else {
      if (agents.edges.length > 0) {
        return agents.edges.map((edge) => <AgentRow key={edge.node.id} agent={edge.node} />);
      } else {
        return <Panel.Section className="dark-gray">No agents connected</Panel.Section>;
      }
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
      }
    }
  }

  handleSearch = (query) => {
    this.setState({ searching: true });

    let search;
    if (query === "") {
      search = null;
    } else {
      search = query.split(" ");
    }

    this.props.relay.forceFetch({ search: search }, (readyState) => {
      if (readyState.done) {
        this.setState({ searching: null });
      }
    });
  };

  handleLoadMoreAgentsClick = () => {
    this.props.relay.setVariables({
      pageSize: this.props.relay.variables.pageSize + PAGE_SIZE
    });
  };
}

export default Relay.createContainer(Agents, {
  initialVariables: {
    isMounted: false,
    search: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        agents(first: $pageSize, metaData: $search) @include(if: $isMounted) {
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
