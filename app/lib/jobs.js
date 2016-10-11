export function jobTime(job) {
  const { state, startedAt, finishedAt, canceledAt, timedOutAt } = job;
  const time = {};

  // job never stared, so no duration to show
  if (!startedAt) {
    return time;
  }

  time.from = startedAt;

  switch (state) {
    case 'finished':
      time.to = finishedAt;
      break;

    case 'canceled':
    case 'canceling':
      time.to = canceledAt;
      break;

    case 'timed_out':
    case 'timing_out':
      time.to = timedOutAt;
      break;
  }

  return time;
}
