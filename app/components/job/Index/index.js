import React from 'react';
import Relay from 'react-relay';
import { seconds } from 'metrick/duration';

import Spinner from '../../shared/Spinner';
import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';
import PageWithContainer from '../../shared/PageWithContainer';

import JobRow from './job-row';
import StateSelector from './state-selector';

const PAGE_SIZE = 100;

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    loadingMore: false,
    switchingStates: false,
    selectedJobState: null
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
              <div className="relative flex-auto">
                <div className="absolute pointer-events-none" style={{ left: 8, top: 5 }}>
                  {this.renderSearchIcon()}
                </div>
                <input type="text" className="input" placeholder="Search by agent query rules…" style={{ paddingLeft: 28 }} onKeyUp={this.handleAgentQueryRuleSearch} />
              </div>

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

  renderSearchIcon() {
    if (this.state.searching) {
      return (
        <Spinner size={15} color={false}/>
      );
    } else {
      return (
        <Icon icon="search" className="gray" style={{ width: 15, height: 15 }} />
      );
    }
  }

  renderFooter() {
    if (!this.props.organization.jobs || !this.props.organization.jobs.pageInfo.hasNextPage || this.state.switchingStates) {
      return null;
    }

    if (this.state.loadingMore) {
      return (
        <Panel.Footer className="center">
          <Spinner style={{ margin: 8 }} />
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
            <div>No jobs here!</div>
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

  handleAgentQueryRuleSearch = (event) => {
    const agentQueryRules = event.target.value === "" ? null : event.target.value.split(" ");

    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      delete this._timeout;

      this.setState({ searching: true });

      this.props.relay.forceFetch({ agentQueryRules: agentQueryRules }, (readyState) => {
        if (readyState.done) {
          this.setState({ searching: false });
        }
      });
    }, 1::seconds);
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
    state: null,
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
