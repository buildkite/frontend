/* global describe, test, expect */
import { shortMessage, shortCommit } from './commits';

describe('shortMessage', () => {
  const BIG_MESSAGE = `✨ Somehow this is the first spec I've written for our front-end, and this seems really odd to me

- this should be a big enough message to make sure we're not running into anything silly`;

  test('returns the first line of a multi-line message', () => {
    expect(shortMessage(BIG_MESSAGE)).toMatchSnapshot();
  });

  test('returns the whole message in a one-line message', () => {
    expect(shortMessage('Bump frontend')).toMatchSnapshot();
  });
});

describe('shortCommit', () => {
  test('returns a 7-character SHA1 for a full SHA1 commitish', () => {
    expect(shortCommit('be9c03b0dbddafccb0882f62182b84924579c93b')).toMatchSnapshot();
  });

  test('returns the full name for a non-SHA1 commitish', () => {
    expect(shortCommit('preload-pipeline-names-sperlunking')).toMatchSnapshot();
  });

  test('returns the full name for a 40-character non-SHA1 commitish', () => {
    expect(shortCommit('so-this-is-a-forty-character-branch-name')).toMatchSnapshot();
  });
});
