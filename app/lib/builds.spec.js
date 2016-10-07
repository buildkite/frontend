/* global describe, it, expect */
import { shortMessage, shortCommit, buildTime, buildStatus } from './builds';

describe('shortMessage', () => {
  const BIG_MESSAGE = `✨ Somehow this is the first spec I've written for our front-end, and this seems really odd to me

- this should be a big enough message to make sure we're not running into anything silly`;

  it('returns the first line of a multi-line message', () => {
    expect(shortMessage(BIG_MESSAGE)).toMatchSnapshot();
  });

  it('returns the whole message in a one-line message', () => {
    expect(shortMessage('Bump frontend')).toMatchSnapshot();
  });
});

describe('shortCommit', () => {
  it('returns a 7-character SHA1 for a full SHA1 commitish', () => {
    expect(shortCommit('be9c03b0dbddafccb0882f62182b84924579c93b')).toMatchSnapshot();
  });

  it('returns the full name for a non-SHA1 commitish', () => {
    expect(shortCommit('preload-pipeline-names-sperlunking')).toMatchSnapshot();
  });

  it('returns the full name for a 40-character non-SHA1 commitish', () => {
    expect(shortCommit('so-this-is-a-forty-character-branch-name')).toMatchSnapshot();
  });
});

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
