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
const SEARCH_KEYWORDS = ['state', 'agent', 'concurrency-group'];

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    searching: false,
    paginating: false,
    query: "state:scheduled"
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <PageWithContainer>
        <Panel>
          <Panel.Header>{this.props.organization.name} Jobs</Panel.Header>
          <Panel.Section>
            <div className="flex items-center">
              <SearchField
                className="flex-auto"
                placeholder="Search jobs…"
                onChange={this.handleSearch}
                searching={this.state.searching}
              />
            </div>
            <div className="dark-gray">
              Do something like this and you'll be fine.
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

    if (!jobs) {
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

  handleSearch = (value) => {
    const searchQueryParams = searchQuery.parse(value, { keywords: SEARCH_KEYWORDS });
    const variables = { concurrency: { group: null }, states: null, agentQueryRules: null };

    if (typeof (searchQueryParams) == 'string') {
      // todo
    } else {
      variables.concurrency.group = searchQueryParams['concurrency-group'];
      variables.agentQueryRules = searchQueryParams['agent'];
      variables.states = searchQueryParams['state'];
    }

    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      delete this._timeout;

      this.setState({ searching: true });

      this.props.relay.forceFetch(variables, (readyState) => {
        if (readyState.done) {
          this.setState({ searching: false });
        }
      });
    }, 1::second);
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

export default Relay.createContainer(AgentIndex, {
  initialVariables: {
    isMounted: false,
    states: null,
    agentQueryRules: null,
    concurrency: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        jobs(first: $pageSize, type: COMMAND, state: $states, agentQueryRules: $agentQueryRules, concurrency: $concurrency) @include(if: $isMounted) {
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
