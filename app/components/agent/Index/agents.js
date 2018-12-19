import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { second, seconds } from 'metrick/duration';
import throttle from 'throttleit';

import Panel from 'app/components/shared/Panel';
import SearchField from 'app/components/shared/SearchField';
import ShowMoreFooter from 'app/components/shared/ShowMoreFooter';
import Spinner from 'app/components/shared/Spinner';
import { formatNumber } from 'app/lib/number';

import CentrifugeStore from 'app/stores/CentrifugeStore';

import AgentRow from './row';

const PAGE_SIZE = 100;

class Agents extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      allAgents: PropTypes.shape({
        count: PropTypes.number.isRequired
      }),
      agents: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.array.isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    loading: false,
    searchingRemotely: false,
    searchingRemotelyIsSlow: false,
    localSearchQuery: null
  };

  componentDidMount() {
    // We've marked the data requirements for this compoent with `@include(if:
    // $isMounted)` which allows us to defer the actual loading of the data
    // until we're ready. This keeps the page speedy to load and we can load
    // the Agents in after this component has mounted.
    //
    // We use `forceFetch` instead of `setVariables` because we want to re-grab
    // the entire agent list when we come to/from the Agents page whether it's
    // via react-router or the back/forward button in the browser.
    this.props.relay.forceFetch({ isMounted: true }, (readyState) => {
      if (readyState.done) {
        CentrifugeStore.on('organization_stats:change', this.fetchUpdatedData);
        this.startTimeout();
      }
    });
  }

  componentWillUnmount() {
    CentrifugeStore.off('organization_stats:change', this.fetchUpdatedData);
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

  render() {
    // grab (potentially) filtered agent list here, as we need it in several places
    const agents = this.getRelevantAgents();

    return (
      <Panel>
        <Panel.Row>
          <SearchField
            placeholder="Search agents…"
            onChange={this.handleSearch}
            searching={this.state.searchingRemotelyIsSlow}
          />
        </Panel.Row>
        {this.renderSearchInfo(agents)}
        {this.renderAgentList(agents)}
        <ShowMoreFooter
          connection={this.props.organization.agents}
          label="agents"
          loading={this.state.loading}
          searching={!!this.state.localSearchQuery}
          onShowMore={this.handleShowMoreAgents}
        />
      </Panel>
    );
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
      const [key, value] = string.split('=');

      return {
        string: string.toLowerCase(),
        metaDataKey: key,
        metaDataValue: value // may be undefined
      };
    });

    const anyQueryMatchesName = (agent) => {
      const lowercaseName = agent.name.toLowerCase();

      return queries.some((query) => lowercaseName.indexOf(query.string) !== -1);
    };

    const anyQueryMatchesMetaData = (agent) => {
      return agent.metaData.some((metaDataKeyValue) => {
        const [key, value] = metaDataKeyValue.split('=');

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
    }

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

    if (this.remoteSearchIsSlowTimeout) {
      clearTimeout(this.remoteSearchIsSlowTimeout);
    }

    this.remoteSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingRemotelyIsSlow: true });
    }, 1::second);

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

  handleShowMoreAgents = () => {
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
          ${ShowMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              metaData
              name
              ${AgentRow.getFragment('agent')}
            }
          }
        }
      }
    `
  }
});
