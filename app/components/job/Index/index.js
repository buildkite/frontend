import React from 'react';
import Relay from 'react-relay';
import { second } from 'metrick/duration';

import SearchField from '../../shared/SearchField';
import Spinner from '../../shared/Spinner';
import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import PageWithContainer from '../../shared/PageWithContainer';

import JobStatesConstants from '../../../constants/JobStates';

import JobRow from './job-row';
import StateSelector from './state-selector';

const PAGE_SIZE = 100;

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    searching: false,
    loadingMore: false,
    switchingStates: false,
    selectedJobState: JobStatesConstants.SCHEDULED
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <PageWithContainer>
        <Panel>
          <Panel.Header>Job Explorer</Panel.Header>
          <Panel.Section>
            <div className="flex items-center">
              <SearchField
                className="flex-auto"
                placeholder="Search by agent query rules…"
                onChange={this.handleAgentQueryRuleSearch}
                searching={this.state.searching}
              />

              <div className="flex-none pl3 flex">
                <div className="semi-bold mr1">States:</div> <StateSelector selection={this.state.selectedJobState} onSelect={this.handleStateSelection} />
              </div>
            </div>
          </Panel.Section>
          {this.renderJobsList()}
          {this.renderFooter()}
        </Panel>
      </PageWithContainer>
    );
  }

  renderFooter() {
    if (!this.props.organization.jobs || !this.props.organization.jobs.pageInfo.hasNextPage || this.state.switchingStates) {
      return null;
    }

    if (this.state.loadingMore) {
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

    if (!jobs || this.state.switchingStates) {
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
              There are no {this.state.selectedJobState.toLowerCase()} jobs
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

  handleAgentQueryRuleSearch = (value) => {
    const agentQueryRules = value === "" ? null : value.split(" ");

    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      delete this._timeout;

      this.setState({ searching: true });

      this.props.relay.forceFetch({ agentQueryRules: agentQueryRules }, (readyState) => {
        if (readyState.done) {
          this.setState({ searching: false });
        }
      });
    }, 1::second);
  };

  handleStateSelection = (state) => {
    this.setState({ switchingStates: true, selectedJobState: state });

    // Dunno why state comes through as `null`
    const newState = state === "null" ? null : state;

    this.props.relay.forceFetch({ state: newState, pageSize: PAGE_SIZE }, (readyState) => {
      if (readyState.done) {
        this.setState({ switchingStates: false });
      }
    });
  };

  handleLoadMoreClick = () => {
    this.setState({ loadingMore: true });

    const newPageSize = this.props.relay.variables.pageSize + PAGE_SIZE;

    this.props.relay.forceFetch({ pageSize: newPageSize }, (readyState) => {
      if (readyState.done) {
        this.setState({ loadingMore: false });
      }
    });
  };
}

export default Relay.createContainer(AgentIndex, {
  initialVariables: {
    isMounted: false,
    state: JobStatesConstants.SCHEDULED,
    agentQueryRules: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        jobs(first: $pageSize, type: COMMAND, state: $state, agentQueryRules: $agentQueryRules) @include(if: $isMounted) {
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
