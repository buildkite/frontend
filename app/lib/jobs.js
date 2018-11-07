// @flow

import JobStates from 'app/constants/JobStates';

export function jobTime(job: Object) {
  const { state, startedAt, finishedAt, canceledAt, timedOutAt } = job;
  const time = {};

  // job never stared, so no duration to show
  if (!startedAt) {
    return time;
  }

  time.from = startedAt;

  switch (state) {
    case JobStates.FINISHED:
      time.to = finishedAt;
      break;

    case JobStates.CANCELED:
    case JobStates.CANCELING:
      time.to = canceledAt;
      break;

    case JobStates.TIMED_OUT:
    case JobStates.TIMING_OUT:
      time.to = timedOutAt;
      break;
  }

  return time;
}
