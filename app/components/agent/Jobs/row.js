// @flow
/* eslint-disable react/prop-types */

import React from 'react';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';

import FriendlyTime from '../../shared/FriendlyTime';
import JobLink from '../../shared/JobLink';
import JobState from '../../icons/JobState';
import Panel from '../../shared/Panel';

type Props = {
  job: {
    uuid: string,
    state: string,
    passed: boolean,
    startedAt?: string
  }
};

class AgentJobRow extends React.PureComponent<Props> {
  render() {
    const job = this.props.job;

    return (
      <Panel.Row>
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
    );
  }
}

export default Relay.createContainer(AgentJobRow, {
  fragments: {
    job: () => Relay.QL`
      fragment on Job {
        ${JobLink.getFragment('job')}
        ...on JobTypeCommand {
          uuid
          state
          passed
          startedAt
        }
      }
    `
  }
});
