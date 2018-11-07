// @flow

import BuildStates from 'app/constants/BuildStates';

export function buildTime(build: Object) {
  const { state, startedAt, canceledAt, finishedAt, scheduledAt } = build;
  const buildTime = {};

  switch (state) {
    case BuildStates.CANCELING:
    case BuildStates.FAILED:
    case BuildStates.PASSED:
    case BuildStates.RUNNING:
    case BuildStates.BLOCKED:
    case BuildStates.CANCELED:
      buildTime.from = startedAt || scheduledAt;
      break;

    case BuildStates.SCHEDULED:
      buildTime.from = scheduledAt;
      break;
  }

  switch (state) {
    case BuildStates.FAILED:
    case BuildStates.PASSED:
      buildTime.to = finishedAt;
      break;

    case BuildStates.BLOCKED:
      if (!buildTime.from) {
        break;
      }

      buildTime.to = finishedAt;
      break;

    case BuildStates.CANCELED:
      if (!buildTime.from) {
        break;
      }

      buildTime.to = canceledAt;
      break;
  }

  return buildTime;
}

export function buildStatus(build: Object) {
  const { state, createdAt, canceledAt, finishedAt } = build;

  if (state === BuildStates.SCHEDULED) {
    return {
      prefix: 'Scheduled',
      timeValue: createdAt
    };
  } else if (state === BuildStates.FAILED) {
    return {
      prefix: 'Failed',
      timeValue: finishedAt
    };
  } else if (state === BuildStates.PASSED) {
    return {
      prefix: 'Passed',
      timeValue: finishedAt
    };
  } else if (state === BuildStates.BLOCKED) {
    return {
      prefix: 'Blocked',
      timeValue: finishedAt
    };
  } else if (state === BuildStates.CANCELED || state === BuildStates.CANCELING) {
    return {
      prefix: 'Canceled',
      timeValue: canceledAt
    };
  } else if (state === BuildStates.SKIPPED) {
    return {
      prefix: 'Skipped',
      timeValue: createdAt
    };
  }

  return {
    prefix: 'Created',
    timeValue: createdAt
  };
}
