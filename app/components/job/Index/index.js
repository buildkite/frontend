import React from 'react';
import Relay from 'react-relay';
import { second } from 'metrick/duration';
import searchQuery from 'search-query-parser';

import SearchField from '../../shared/SearchField';
import Spinner from '../../shared/Spinner';
import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import PageWithContainer from '../../shared/PageWithContainer';

import JobStatesConstants from '../../../constants/JobStates';

import JobRow from './job-row';

const PAGE_SIZE = 100;
const SEARCH_KEYWORDS = ['state', 'concurrency-group'];

class JobIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    searching: false,
    paginating: false,
    query: "queue=default state:scheduled"
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log("OMG MOUNTED");

    // Use the default query if one hasn't alredy been populated by the URL
    const query = this.props.location.query.q !== undefined ? this.props.location.query.q : this.state.query;

    this.performSearch(query);
  }

  componentWillReceiveProps(nextProps) {
    console.log("NEW PROPS");

    // When the `q` param in the URL changes, do a new search
    if (this.props.location.query.q !== nextProps.location.query.q) {
      this.performSearch(nextProps.location.query.q);
    }
  }

  render() {
    return (
      <PageWithContainer>
        <Panel>
          <Panel.Header>{this.props.organization.name} Jobs</Panel.Header>
          <Panel.Section>
            <div className="flex items-top">
              <SearchField
                ref={(_searchFieldNode) => this._searchFieldNode = _searchFieldNode}
                className="flex-auto"
                placeholder="Search by agent query rules…"
                onKeyDown={this.handleSearchKeyDown}
                searching={false}
                defaultValue={this.props.location.query.q || this.state.query}
              />
              <Button outline={true} theme="default" onClick={this.handleSearchClick} className="ml3" style={{lineHeight: '0.9em'}} loading={this.state.searching ? 'Search' : null}>Search</Button>
            </div>
            <div className="dark-gray mt1">
              You can further filter jobs using <code>state:scheduled</code> or <code>concurrency-group:custom-group</code>
            </div>
          </Panel.Section>
          {this.renderJobsList()}
          {this.renderFooter()}
        </Panel>
      </PageWithContainer>
    );
  }

  renderFooter() {
    if (!this.props.organization.jobs || !this.props.organization.jobs.pageInfo.hasNextPage) {
      return null;
    }

    if (this.state.paginating) {
      return (
        <Panel.Footer className="center">
          <Spinner style={{ margin: 9.5 }} />
        </Panel.Footer>
      );
    } else {
      return (
        <Panel.Footer className="center">
          <Button outline={true} theme="default" onClick={this.handleLoadMoreClick}>Load more…</Button>
        </Panel.Footer>
      );
    }
  }

  renderJobsList() {
    const jobs = this.props.organization.jobs;

    if(!this.state.query) {
      return (
        null
      )
    } else if (!jobs || this.state.searching) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    } else {
      if (jobs.edges.length === 0) {
        return (
          <Panel.Section className="center">
            <div>
              No jobs could be found
            </div>
          </Panel.Section>
        );
      } else {
        return jobs.edges.map((edge) => {
          return (
            <JobRow key={edge.node.id} job={edge.node} />
          );
        });
      }
    }
  }

  navigateToSearchQuery() {
    const query = this._searchFieldNode.getValue();

    this.context.router.push(`/organizations/${this.props.organization.slug}/jobs?q=${query}`);
  }

  handleSearchKeyDown = (event) => {
    // Update search query if you hit "ENTER" on the field
    if(event.keyCode == 13) {
      this.navigateToSearchQuery();
    }
  }

  handleSearchClick = () => {
    // Update search query when you click the "SEARCH" button
    this.navigateToSearchQuery();
  };

  performSearch = (query) => {
    console.log(query);

    const searchQueryParams = searchQuery.parse(query, { keywords: SEARCH_KEYWORDS });
    const variables = { concurrency: { group: null }, states: null, agentQueryRules: null, hasSearchQuery: true };

    if (typeof (searchQueryParams) == 'string') {
      variables.agentQueryRules = searchQueryParams;
    } else if (searchQueryParams) {
      variables.agentQueryRules = searchQueryParams.text;
      variables.concurrency.group = searchQueryParams['concurrency-group'];

      // Ensure the states are all upper case since it's a GraphQL enum
      let states = searchQueryParams['state'];
      if(typeof (states) == 'array') {
        variables.states = states.map((state) => state.toUpperCase());
      } else {
        variables.states = states.toUpperCase();
      }
    }

    this.setState({ searching: true, query: query });

    this.props.relay.forceFetch(variables, (readyState) => {
      if (readyState.done) {
        this.setState({ searching: false });
      }
    });
  };

  handleLoadMoreClick = () => {
    this.setState({ paginating: true });

    const newPageSize = this.props.relay.variables.pageSize + PAGE_SIZE;

    this.props.relay.forceFetch({ pageSize: newPageSize }, (readyState) => {
      if (readyState.done) {
        this.setState({ paginating: false });
      }
    });
  };
}

export default Relay.createContainer(JobIndex, {
  initialVariables: {
    hasSearchQuery: false,
    states: null,
    agentQueryRules: null,
    concurrency: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        jobs(first: $pageSize, type: COMMAND, state: $states, agentQueryRules: $agentQueryRules, concurrency: $concurrency) @include(if: $hasSearchQuery) {
          edges {
            node {
              ...on JobTypeCommand {
                id
              }
              ${JobRow.getFragment('job')}
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
