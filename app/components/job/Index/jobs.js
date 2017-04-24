import React from 'react';
import Relay from 'react-relay';
import searchQuery from 'search-query-parser';

import Spinner from '../../shared/Spinner';
import Panel from '../../shared/Panel';
import Button from '../../shared/Button';

import Row from './row';

const PAGE_SIZE = 50;
const SEARCH_KEYWORDS = ['state', 'concurrency-group'];

class Jobs extends React.PureComponent {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired,
    query: React.PropTypes.string
  };

  state = {
    loading: false,
    error: null,
    paginating: false
  };

  constructor(initialProps) {
    super(initialProps);

    // Only default "loading" to true if there's a default query
    this.state = { loading: !!initialProps.query };
  }

  componentDidMount() {
    const variables = this.parseSearchQuery(this.props.query);

    this.props.relay.forceFetch({ isMounted: true, ...variables }, (readyState) => {
      if (readyState.done || readyState.error) {
        this.setState({ loading: false, error: readyState.error });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      const variables = this.parseSearchQuery(nextProps.query);

      this.setState({ loading: true });

      this.props.relay.forceFetch(variables, (readyState) => {
        if (readyState.done || readyState.error) {
          this.setState({ loading: false, error: readyState.error });
        }
      });
    }
  }

  parseSearchQuery(query) {
    const searchQueryParams = searchQuery.parse(query, { keywords: SEARCH_KEYWORDS });
    const variables = { concurrency: { group: null }, states: null, agentQueryRules: null };

    if (typeof searchQueryParams === 'string') {
      variables.agentQueryRules = searchQueryParams;
    } else if (searchQueryParams) {
      variables.agentQueryRules = searchQueryParams.text;
      variables.concurrency.group = searchQueryParams['concurrency-group'];

      // Ensure the states are all upper case since it's a GraphQL enum
      const states = searchQueryParams['state'];
      if (typeof states === 'string') {
        variables.states = states.toUpperCase();
      } else {
        variables.states = states.map((state) => state.toUpperCase());
      }
    }

    return variables;
  }

  render() {
    // Just return a null component if no query was defined
    if (!this.props.query) {
      return null;
    }

    return (
      <Panel>
        {this.renderJobs()}
        {this.renderFooter()}
      </Panel>
    );
  }

  renderJobs() {
    const jobs = this.props.organization.jobs;

    if (this.state.error) {
      return (
        <Panel.Section className="center">
          <div className="red">{this.state.error.message}</div>
        </Panel.Section>
      );
    } else if (!jobs || this.state.loading) {
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
            <Row key={edge.node.id} job={edge.node} />
          );
        });
      }
    }
  }

  renderFooter() {
    if (this.state.paginating) {
      return (
        <Panel.Footer className="center">
          <Spinner style={{ margin: 9.5 }} />
        </Panel.Footer>
      );
    } else if (!this.state.loading && this.props.organization.jobs && this.props.organization.jobs.pageInfo.hasNextPage) {
      return (
        <Panel.Footer className="center">
          <Button outline={true} theme="default" onClick={this.handleLoadMoreClick}>Load more…</Button>
        </Panel.Footer>
      );
    }
  }

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

export default Relay.createContainer(Jobs, {
  initialVariables: {
    isMounted: false,
    agentQueryRules: null,
    concurrency: null,
    states: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        jobs(first: $pageSize, type: COMMAND, state: $states, agentQueryRules: $agentQueryRules, concurrency: $concurrency) @include(if: $isMounted) {
          edges {
            node {
              ...on JobTypeCommand {
                id
              }
              ${Row.getFragment('job')}
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
