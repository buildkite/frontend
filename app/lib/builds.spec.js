/* global describe, it, expect */
import { buildTime, buildStatus } from './builds';

const BUILD_STATES = [
  'BLOCKED',
  'CANCELED',
  'CANCELING',
  'FAILED',
  'NOT_RUN',
  'PASSED',
  'RUNNING',
  'SCHEDULED',
  'SKIPPED',
  'RUNNING'
];

describe('buildTime', () => {
  BUILD_STATES.forEach((state) => {
    it(`returns correct time properties for the \`${state}\` state`, () => {
      expect(buildTime({
        state,
        canceledAt: new Date(1475643467000),
        startedAt: new Date(1475643466920),
        finishedAt: new Date(1475643467000),
        scheduledAt: new Date(1475644466920)
      })).toMatchSnapshot();

      expect(buildTime({
        state,
        scheduledAt: new Date(1475644466920),
        canceledAt: new Date(1475643467000),
        finishedAt: new Date(1475643467000)
      })).toMatchSnapshot();

      if (['CANCELED', 'BLOCKED'].indexOf(state) !== -1) {
        expect(buildTime({
          state,
          canceledAt: new Date(1475643467000),
          finishedAt: new Date(1475643467000)
        })).toMatchSnapshot();
      }
    });
  });
});

describe('buildStatus', () => {
  BUILD_STATES.forEach((state) => {
    it(`returns correct build status for the \`${state}\` state`, () => {
      expect(buildStatus({
        state,
        canceledAt: new Date(1475643467000),
        createdAt: new Date(1475643466920),
        finishedAt: new Date(1475643467000)
      })).toMatchSnapshot();
    });
  });
});
