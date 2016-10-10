/* global describe, it, expect */
import { buildTime, buildStatus } from './builds';

const BUILD_STATES = [
  'started',
  'failed',
  'passed',
  'blocked',
  'canceled',
  'canceling',
  'scheduled',
  'skipped',
  'not_run'
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

      if (state === 'canceled') {
        expect(buildTime({
          state,
          canceledAt: new Date(1475643467000)
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
