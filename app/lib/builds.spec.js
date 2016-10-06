/* global describe, it, expect */
import { shortMessage, shortCommit, buildTime } from './builds';

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

describe('buildTime', () => {
  it('returns correct time properties for the `started` state', () => {
    expect(buildTime({
      state: 'started',
      startedAt: new Date(1475643466920)
    })).toMatchSnapshot();
  });

  it('returns correct time properties for the `failed` state', () => {
    expect(buildTime({
      state: 'failed',
      startedAt: new Date(1475643466920),
      finishedAt: new Date(1475643467000)
    })).toMatchSnapshot();
  });

  it('returns correct time properties for the `passed` state', () => {
    expect(buildTime({
      state: 'passed',
      startedAt: new Date(1475643466920),
      finishedAt: new Date(1475643467000)
    })).toMatchSnapshot();
  });

  it('returns correct time properties for the `canceled` state', () => {
    expect(buildTime({
      state: 'canceled',
      startedAt: new Date(1475643466920),
      canceledAt: new Date(1475643467000)
    })).toMatchSnapshot();
    expect(buildTime({ state: 'canceled' })).toMatchSnapshot();
  });

  it('returns correct time properties for the `canceling` state', () => {
    expect(buildTime({
      state: 'canceling',
      startedAt: new Date(1475643466920)
    })).toMatchSnapshot();
  });

  it('returns correct time properties for the `scheduled` state', () => {
    expect(buildTime({
      state: 'scheduled',
      scheduledAt: new Date(1475644466920)
    })).toMatchSnapshot();
  });

  it('returns correct time properties for the `skipped` state', () => {
    expect(buildTime({ state: 'skipped' })).toMatchSnapshot();
  });

  it('returns correct time properties for the `not_run` state', () => {
    expect(buildTime({ state: 'not_run' })).toMatchSnapshot();
  });
});

