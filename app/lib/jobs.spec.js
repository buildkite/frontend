/* global describe, it, expect */
import { jobTime } from './jobs';

const JOB_STATES = [
  'pending',
  'waiting',
  'waiting_failed',
  'blocked',
  'blocked_failed',
  'unblocked',
  'unblocked_failed',
  'scheduled',
  'assigned',
  'accepted',
  'running',
  'finished',
  'canceling',
  'canceled',
  'timing_out',
  'timed_out',
  'skipped',
  'broken'
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