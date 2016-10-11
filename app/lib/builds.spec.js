/* global describe, it, expect */
import { buildTime, buildStatus } from './builds';

const BUILD_STATES = [
  'blocked',
  'canceled',
  'canceling',
  'failed',
  'not_run',
  'passed',
  'running',
  'scheduled',
  'skipped',
  'started'
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
          canceledAt: new Date(1475643467000),
          finishedAt: new Date(1475643467000)
        })).toMatchSnapshot();

        expect(buildTime({
          state,
          scheduledAt: new Date(1475644466920),
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
