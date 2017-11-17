import React from 'react';
import PropTypes from 'prop-types';

import BuildStates from '../../constants/BuildStates';
import JobStates from '../../constants/JobStates';

import BuildState from './BuildState';

const getBuildStateForJob = (job) => {
  // Naïvely transliterate Job state to Build state
  switch (job.state) {
    case JobStates.FINISHED:
      return (
        job.passed
          ? BuildStates.PASSED
          : BuildStates.FAILED
      );
    case JobStates.PENDING:
    case JobStates.WAITING:
    case JobStates.UNBLOCKED:
    case JobStates.LIMITED:
    case JobStates.ASSIGNED:
    case JobStates.ACCEPTED:
      return BuildStates.SCHEDULED;
    case JobStates.TIMING_OUT:
    case JobStates.TIMED_OUT:
    case JobStates.WAITING_FAILED:
    case JobStates.BLOCKED_FAILED:
    case JobStates.UNBLOCKED_FAILED:
    case JobStates.BROKEN:
      return BuildStates.FAILED;
    default:
      return job.state;
  }
};

const exported = {};

Object.keys(BuildState).forEach((size) => {
  const BuildStateComponent = BuildState[size];

  const component = ({ job, ...props }) => (
    <BuildStateComponent
      {...props}
      state={getBuildStateForJob(job)}
    />
  );
  component.displayName = `JobState.${size}`;
  component.propTypes = {
    job: PropTypes.shape({
      state: PropTypes.oneOf(Object.keys(JobStates)).isRequired,
      passed: PropTypes.bool.isRequired
    }).isRequired
  };

  exported[size] = component;
});

export default exported;
