import React from 'react';

import BuildStates from '../../constants/BuildStates';

import BuildState from './BuildState';

const getBuildStateForJob = (job) => {
  // Naïvely transliterate Job state to Build state
  switch (job.state) {
    case 'FINISHED':
      return (
        job.passed
          ? BuildStates.PASSED
          : BuildStates.FAILED
      );
    case 'PENDING':
    case 'WAITING':
    case 'UNBLOCKED':
    case 'LIMITED':
    case 'ASSIGNED':
    case 'ACCEPTED':
      return BuildStates.SCHEDULED;
    case 'TIMING_OUT':
    case 'TIMED_OUT':
    case 'WAITING_FAILED':
    case 'BLOCKED_FAILED':
    case 'UNBLOCKED_FAILED':
    case 'BROKEN':
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

  exported[size] = component;
});

export default exported;
