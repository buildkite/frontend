import React from 'react';
import Relay from 'react-relay';

import Spinner from '../../shared/Spinner';
import Panel from '../../shared/Panel';
import PageWithContainer from '../../shared/PageWithContainer';

import JobRow from './job-row';

const PAGE_SIZE = 100;

class AgentIndex extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true }, (readyState) => {
      // if (readyState.done) {
      //   this.startTimeout();
      // }
    });
  }

  render() {
    return (
      <PageWithContainer>
        <Panel>
          <Panel.Header>Job Explorer</Panel.Header>
          {this.renderJobsList()}
        </Panel>
      </PageWithContainer>
    );
  }

  renderJobsList() {
    const jobs = this.props.organization.jobs;

    if(jobs) {
      return jobs.edges.map((edge) => {
        return (
          <JobRow key={edge.node.id} job={edge.node} />
        );
      });
    } else {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      )
    }
  }
}

export default Relay.createContainer(AgentIndex, {
  initialVariables: {
    isMounted: false,
    agentQueryRules: null,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        jobs(first: $pageSize, type: COMMAND) @include(if: $isMounted) {
          edges {
            node {
              ...on JobTypeCommand {
                id
              }
              ${JobRow.getFragment('job')}
            }
          }
        }
      }
    `
  }
});
