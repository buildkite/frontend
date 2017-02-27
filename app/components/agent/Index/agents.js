import React from 'react';
import Relay from 'react-relay';
import { seconds } from 'metrick/duration';
import shallowCompare from 'react-addons-shallow-compare';
import throttle from 'throttleit';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';
import { formatNumber } from '../../../lib/number';

import PusherStore from '../../../stores/PusherStore';

import AgentRow from './row';
import Search from './search';

const PAGE_SIZE = 100;

class Agents extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      allAgents: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
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
    searchingRemotelyIsSlow: false,
    localSearchQuery: null
  };

  componentDidMount() {
    this.props.relay.setVariables(
      {
        isMounted: true
      },
      (readyState) => {
        if (readyState.done) {
          PusherStore.on('organization_stats:change', this.fetchUpdatedData);
          this.startTimeout();
        }
      }
    );
  }

  componentWillUnmount() {
    PusherStore.off('organization_stats:change', this.fetchUpdatedData);
    clearTimeout(this._agentListRefreshTimeout);
  }

  // We refresh the data under 2 circumstances. The refresh happens on what
  // ever happens first.
  //
  // 1. We receive an `organization_stats:change` push event
  // 2. 10 seconds have passed
  startTimeout = () => {
    this._agentListRefreshTimeout = setTimeout(
      this.fetchUpdatedData,
      10::seconds
    );
  };

  // Throttle the `fetchUpdatedData` function so we don't ever reload the
  // entire list more than once every 3 seconds
  fetchUpdatedData = throttle(
    () => {
      this.props.relay.forceFetch(
        true,
        (readyState) => {
          if (readyState.done) {
            // Start a timeout that will cause the data to be refreshed again
            // in a few seconds time
            this.startTimeout();
          }
        }
      );
    },
    3::seconds
  );

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    // grab (potentially) filtered agent list here, as we need it in several places
    const agents = this.getRelevantAgents();

    return (
      <Panel>
        <div className="bg-silver semi-bold">
          <div className="flex items-center">
            <div className="flex-auto py2 px3">Agents</div>
            <div className="flex items-center mr3">
              {this.renderSearchSpinner()}
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

  renderSearchSpinner() {
    if (this.state.searchingRemotelyIsSlow) {
      return (
        <Spinner className="mr2" />
      );
    }
  }

  getRelevantAgents() {
    const { organization: { agents: { edges: agents } = { } } } = this.props;
    const { localSearchQuery } = this.state;

    if (!localSearchQuery) {
      return agents;
    }

    // Parse the search. We only want to do this once, outside of the agent
    // loop, in case they have lots of agents
    const queries = localSearchQuery.map((string) => {
      return {
        string: string.toLowerCase(),
        metaDataKey: string.split('=')[0],
        metaDataValue: string.split('=')[1] // may be undefined
      };
    });

    const anyQueryMatchesName = (agent) => {
      const lowercaseName = agent.name.toLowerCase();

      return queries.some((query) => lowercaseName.indexOf(query.string) !== -1);
    };

    const anyQueryMatchesMetaData = (agent) => {
      return agent.metaData.some((metaDataKeyValue) => {
        const [key, value] = metaDataKeyValue.toLowerCase().split('=');

        return queries.some((query) => {
          // Simple string match
          //
          // 'mo' matches 'moo=true'
          // 'tru' matches 'moo=true'
          // 'bark' does not match 'moo=true'
          if (!query.metaDataValue && key.indexOf(query.metaDataKey) !== -1 || value.indexOf(query.metaDataKey) !== -1) {
            return true;
          }

          // Wildcard matching
          //
          // 'moo=*' matches 'moo=true'
          // 'moo=*' doesn't match 'bark=true'
          if (query.metaDataKey === key && query.metaDataValue === '*') {
            return true;
          }

          // Key=Value matching
          //
          // 'moo=tr' matches 'moo=true'
          // 'moo=true' matches 'moo=true'
          // 'moo=rue' doesn't match 'moo=true'
          // 'moo=false' doesn't match 'moo=true'
          if (query.metaDataKey === key && value.indexOf(query.metaDataValue) === 0) {
            return true;
          }
        });
      });
    };

    return agents.filter(({ node: agent }) => {
      return anyQueryMatchesName(agent) || anyQueryMatchesMetaData(agent);
    });
  }

  renderSearchInfo(relevantAgents) {
    const { organization: { agents }, relay: { variables: { search: remoteSearchQuery } } } = this.props;
    const { localSearchQuery } = this.state;

    if ((localSearchQuery && relevantAgents) || remoteSearchQuery && agents) {
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
    const { localSearchQuery } = this.state;

    const isContextFiltered = !!(remoteSearchQuery || localSearchQuery);

    if (!relevantAgents) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    } else if (relevantAgents.length > 0) {
      return relevantAgents.map(({ node: agent }) => <AgentRow key={agent.id} agent={agent} />);
    } else if (!isContextFiltered) {
      return (
        <Panel.Section className="dark-gray">
          No agents connected
        </Panel.Section>
      );
    }
  }

  renderFooter() {
    const { organization } = this.props;
    const { loading, localSearchQuery } = this.state;

    // don't show any footer if we're searching locally
    if (localSearchQuery) {
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

  get useLocalSearch() {
    return this.props.organization.agents &&
      this.props.organization.allAgents.count <= PAGE_SIZE;
  }

  get useRemoteSearch() {
    return !this.useLocalSearch;
  }

  handleSearch = (query) => {
    if (this.useLocalSearch) {
      return this.handleLocalSearch(query);
    } else {
      return this.handleRemoteSearch(query);
    }
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

    if (this.remoteSearchIsSlowTimeout) {
      clearTimeout(this.remoteSearchIsSlowTimeout);
    }

    this.remoteSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingRemotelyIsSlow: true });
    }, 1::seconds);

    this.props.relay.forceFetch(
      {
        search: query
      },
      (readyState) => {
        if (readyState.done) {
          if (this.remoteSearchIsSlowTimeout) {
            clearTimeout(this.remoteSearchIsSlowTimeout);
          }
          this.setState({
            searchingRemotely: false,
            searchingRemotelyIsSlow: false
          });
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
        allAgents: agents @include(if: $isMounted) {
          count
        }
        agents(first: $pageSize, search: $search) @include(if: $isMounted) {
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
