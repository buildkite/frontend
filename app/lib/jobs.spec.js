/* global describe, it, expect */
import { jobTime, jobWaitTime } from './jobs';

const JOB_STATES = [
  'PENDING',
  'WAITING',
  'WAITING_FAILED',
  'BLOCKED',
  'BLOCKED_FAILED',
  'UNBLOCKED',
  'UNBLOCKED_FAILED',
  'SCHEDULED',
  'ASSIGNED',
  'ACCEPTED',
  'RUNNING',
  'FINISHED',
  'CANCELING',
  'CANCELED',
  'TIMING_OUT',
  'TIMED_OUT',
  'SKIPPED',
  'BROKEN'
];

describe('jobTime', () => {
  JOB_STATES.forEach((state) => {
    it(`returns correct time properties for the \`${state}\` state`, () => {
      expect(jobTime({
        state,
        canceledAt: new Date(1475643467000),
        startedAt: new Date(1475643466920),
        finishedAt: new Date(1475643467000),
        timedOutAt: new Date(1475644466920)
      })).toMatchSnapshot();

      expect(jobTime({
        state,
        canceledAt: new Date(1475643467000),
        finishedAt: new Date(1475643467000)
      })).toMatchSnapshot();

      expect(jobTime({
        state,
        timedOutAt: new Date(1475644466920),
        canceledAt: new Date(1475643467000),
        finishedAt: new Date(1475643467000)
      })).toMatchSnapshot();
    });
  });
});

describe('jobWaitTime', () => {
  JOB_STATES.forEach((state) => {
    it(`returns correct time properties for the \`${state}\` state`, () => {
      expect(jobWaitTime({
        state,
        scheduledAt: "2017-10-29T00:32:23.479Z",
        startedAt: "2017-10-29T00:34:37.000Z"
      })).toMatchSnapshot();

      expect(jobWaitTime({
        state,
        scheduledAt: "2017-10-29T00:32:23.479Z"
      })).toMatchSnapshot();
    });
  });
});
