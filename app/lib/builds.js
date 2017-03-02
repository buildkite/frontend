export function buildTime(build) {
  const { state, startedAt, canceledAt, finishedAt, scheduledAt } = build;
  const buildTime = {};

  switch (state) {
    case 'CANCELING':
    case 'FAILED':
    case 'PASSED':
    case 'RUNNING':
    case 'STARTED':
    case 'BLOCKED':
    case 'CANCELED':
      buildTime.from = startedAt || scheduledAt;
      break;

    case 'SCHEDULED':
      buildTime.from = scheduledAt;
      break;
  }

  switch (state) {
    case 'FAILED':
    case 'PASSED':
      buildTime.to = finishedAt;
      break;

    case 'BLOCKED':
      if (!buildTime.from) {
        break;
      }

      buildTime.to = finishedAt;
      break;

    case 'CANCELED':
      if (!buildTime.from) {
        break;
      }

      buildTime.to = canceledAt;
      break;
  }

  return buildTime;
}

export function buildStatus(build) {
  const { state, createdAt, canceledAt, finishedAt } = build;

  if (state === 'SCHEDULED') {
    return {
      prefix: 'Scheduled',
      timeValue: createdAt
    };
  } else if (state === 'FAILED') {
    return {
      prefix: 'Failed',
      timeValue: finishedAt
    };
  } else if (state === 'PASSED') {
    return {
      prefix: 'Passed',
      timeValue: finishedAt
    };
  } else if (state === 'BLOCKED') {
    return {
      prefix: 'Blocked',
      timeValue: finishedAt
    };
  } else if (state === 'CANCELED' || state === 'CANCELING') {
    return {
      prefix: 'Canceled',
      timeValue: canceledAt
    };
  } else if (state === 'SKIPPED') {
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
