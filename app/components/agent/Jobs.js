// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import FriendlyTime from '../shared/FriendlyTime';
import JobLink from '../shared/JobLink';
import JobState from '../icons/JobState';
import PageWithContainer from '../shared/PageWithContainer';
import Panel from '../shared/Panel';
import ShowMoreFooter from '../shared/ShowMoreFooter';

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
}

class AgentJobs extends React.PureComponent<Props, State> {
  state = {
    loading: false
  };

  render() {
    return (
      <DocumentTitle title={`${this.props.agent.name} / Recent Jobs · ${this.props.agent.organization.name}`}>
        <PageWithContainer>
          <Panel className="sm-col-9 lg-col-6 mx-auto">
            <Panel.Header>
              <Link
                to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}`}
                className="black text-decoration-none hover-underline"
              >
                {this.props.agent.name}
              </Link>
              {` / Recent Jobs`}
            </Panel.Header>
            {this.props.agent.jobs.edges.map(({ node: job }) => (
              <Panel.Row key={job.uuid}>
                <div className="flex">
                  <JobState.Small
                    job={job}
                    className="flex-none mr2"
                  />
                  <div className="flex-auto md-flex">
                    <JobLink className="block flex-auto" job={job} />
                    <FriendlyTime className="flex-none dark-gray" value={job.startedAt} />
                  </div>
                </div>
              </Panel.Row>
            ))}
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
              ...on JobTypeCommand {
                uuid
                state
                passed
                startedAt
              }
              ${JobLink.getFragment('job')}
            }
          }
          count
        }
      }
    `
  }
});
