import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';
import { formatNumber } from '../../../lib/number';

import AgentRow from './row';
import Search from './search';

const AGENT_LIST_REFRESH_INTERVAL = 10 * 1000;
const PAGE_SIZE = 100;

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
    loading: false,
    searchingRemotely: false,
    localSearchQuery: null
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
    // grab (potentially) filtered agent list here, as we need it in several places
    const agents = this.getRelevantAgents();

    return (
      <Panel>
        <div className="bg-silver semi-bold">
          <div className="flex items-center">
            <div className="flex-auto py2 px3">Agents</div>
            <div className="mr3">
              <Search
                className="input py1 px2"
                placeholder="Filter"
                style={{ fontSize: 12, lineHeight: 1.1, height: 30, width: 160 }}
                onSearch={this.handleSearch}
              />
            </div>
          </div>
        </div>
        {this.renderSearchInfo(agents)}
        {this.renderAgentList(agents)}
        {this.renderFooter()}
      </Panel>
    );
  }

  getRelevantAgents() {
    const { organization: { agents: { edges: agents } = { } } } = this.props;
    const { localSearchQuery } = this.state;

    // return all agents if the search query is falsy
    if (!localSearchQuery) {
      return agents;
    }

    // otherwise, filter by name and metaData
    return agents.filter(({ node: agent }) => {
      const foundInName = localSearchQuery.some((query) =>
        agent.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );

      const foundInMetaData = agent.metaData.some((metaDataKeyValue) =>
        localSearchQuery.some((query) =>
          (query.indexOf('=') === -1 ? metaDataKeyValue.split('=').pop() : metaDataKeyValue).toLowerCase().indexOf(query.toLowerCase()) !== -1
        )
      );

      return foundInName || foundInMetaData;
    });
  }

  renderSearchInfo(relevantAgents) {
    const { organization: { agents }, relay: { variables: { search: remoteSearchQuery } } } = this.props;
    const { searchingRemotely, localSearchQuery } = this.state;

    if ((localSearchQuery && relevantAgents) || remoteSearchQuery && agents && !searchingRemotely) {
      return (
        <div className="bg-silver semi-bold py2 px3">
          <small className="dark-gray">
            {formatNumber(localSearchQuery ? relevantAgents.length : agents.count)} matching agents
          </small>
        </div>
      );
    }
  }

  renderAgentList(relevantAgents) {
    const { relay: { variables: { search: remoteSearchQuery } } } = this.props;
    const { searchingRemotely, localSearchQuery } = this.state;

    const isContextFiltered = !!(remoteSearchQuery || localSearchQuery);

    if (!relevantAgents || searchingRemotely) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }

    if (relevantAgents.length > 0) {
      return relevantAgents.map(({ node: agent }) => <AgentRow key={agent.id} agent={agent} />);
    }

    return (
      <Panel.Section className="dark-gray">
        No agents {isContextFiltered ? 'found' : 'connected'}
      </Panel.Section>
    );
  }

  renderFooter() {
    const { organization } = this.props;
    const { loading, searchingRemotely, localSearchQuery } = this.state;

    // don't show any footer if we're searching locally, or awaiting results
    if (localSearchQuery || searchingRemotely) {
      return;
    }

    // don't show any footer if we haven't ever loaded
    // any agents, or if there's no next page
    if (!organization.agents || !organization.agents.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreAgentsClick}
      >
        Load more agents…
      </Button>
    );

    // show a spinner if we're loading more agents
    if (loading) {
      footerContent = <Spinner style={{ margin: 8 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleSearch = (query) => {
    const { organization } = this.props;

    // if we have the full set of agents locally, do our searching here
    if (organization.agents && organization.agents.edges.length > 0 && !organization.agents.pageInfo.hasNextPage) {
      return this.handleLocalSearch(query);
    }

    // if we haven't loaded anything yet, last retrieved a total of 0 agents,
    // or have more agents than are displayed, do the searching on the server
    return this.handleRemoteSearch(query);
  };

  handleLocalSearch = (query) => {
    // if there's a remote search active we make doubly sure to
    // reset it this shouldn't happen but stranger things have!
    const shouldResetSearch = !!this.props.relay.variables.search;

    // remove leading and trailing whitespace
    query = query.trim();

    const newState = {
      localSearchQuery: query ? query.split(/\s+/g) : null
    };

    if (shouldResetSearch) {
      newState.searchingRemotely = true;
    }

    this.setState(newState);

    if (shouldResetSearch) {
      this.props.relay.setVariables(
        {
          search: null
        },
        (readyState) => {
          if (readyState.done) {
            this.setState({ searchingRemotely: false });
          }
        }
      );
    }
  };

  handleRemoteSearch = (query) => {
    this.setState({ localSearchQuery: null, searchingRemotely: true });

    let search = null;
    if (query) {
      search = query.split(/\s+/g);
    }

    this.props.relay.forceFetch(
      {
        search: search
      },
      (readyState) => {
        if (readyState.done) {
          this.setState({ searchingRemotely: false });
        }
      }
    );
  };

  handleLoadMoreAgentsClick = () => {
    this.setState({ loading: true });

    this.props.relay.setVariables(
      {
        pageSize: this.props.relay.variables.pageSize + PAGE_SIZE
      },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
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
              metaData
              name
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
