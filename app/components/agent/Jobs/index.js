// @flow
/* eslint-disable react/prop-types */

import React from 'react';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import { seconds } from 'metrick/duration';

import PageWithContainer from '../../shared/PageWithContainer';
import Panel from '../../shared/Panel';
import ShowMoreFooter from '../../shared/ShowMoreFooter';

import AgentJobRow from './row';

const PAGE_SIZE = 25;

type Props = {
  agent: {
    uuid: string,
    name: string,
    jobs: {
      count: number,
      edges: Array<{
        node: {
          uuid: string,
          state: string,
          passed: boolean,
          startedAt?: string
        }
      }>
    },
    organization: {
      slug: string,
      name: string
    }
  },
  relay: Object
};

type State = {
  loading: boolean
};

class AgentJobs extends React.PureComponent<Props, State> {
  state = {
    loading: false
  };

  _agentRefreshTimeout: number;

  componentDidMount() {
    // Only bother setting up the delayed load and refresher if we've got an
    // actual agent to play with.
    if (this.props.agent && this.props.agent.uuid) {
      // This will cause a full refresh of the data every 3 seconds. This seems
      // very low, but chances are people aren't really looking at this page
      // for long periods of time.
      this.startTimeout();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._agentRefreshTimeout);
  }

  startTimeout = () => {
    this._agentRefreshTimeout = setTimeout(
      this.fetchUpdatedData,
      seconds.bind(3)
    );
  };

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(
      true,
      (readyState) => {
        if (readyState.done) {
          this.startTimeout();
        }
      }
    );
  };

  render() {
    return (
      <DocumentTitle title={`${this.props.agent.name} / Jobs · ${this.props.agent.organization.name}`}>
        <PageWithContainer>
          <Panel className="sm-col-9 lg-col-6 mx-auto">
            <Panel.Header>
              <Link
                to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}`}
                className="black text-decoration-none hover-underline"
              >
                {this.props.agent.name}
              </Link>
              {` / Jobs`}
            </Panel.Header>
            {this.renderJobList()}
            <ShowMoreFooter
              connection={this.props.agent.jobs}
              label="jobs"
              loading={this.state.loading}
              onShowMore={this.handleShowMoreJobs}
            />
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderJobList() {
    const jobs = this.props.agent.jobs.edges;

    if (jobs.length < 1) {
      return (
        <Panel.Section className="dark-gray">
          This agent has not run any jobs
        </Panel.Section>
      );
    }

    return jobs.map((edge) => (
      <AgentJobRow
        job={edge.node}
        key={edge.node.uuid}
      />
    ));
  }

  handleShowMoreJobs = () => {
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

export default Relay.createContainer(AgentJobs, {
  initialVariables: {
    pageSize: PAGE_SIZE
  },

  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        uuid
        name
        organization {
          name
          slug
        }
        jobs(first: $pageSize) {
          ${ShowMoreFooter.getFragment('connection')}
          edges {
            node {
              ${AgentJobRow.getFragment('job')}
            }
          }
          count
        }
      }
    `
  }
});
