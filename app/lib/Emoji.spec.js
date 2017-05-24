/* global describe, it, expect, jest */
import Emoji from './Emoji';

function mockLoadWebpackedEmojis(catalogue) {
  process.env.EMOJI_HOST = 'emoji-host.com';

  const loader = require('../../webpack/emoji-loader');
  const emojis = require(`../../vendor/emojis/img-${catalogue}-64.json`);
  const webpack = {};

  return eval(loader.call(webpack, emojis)); // eslint-disable-line no-eval
}

jest.mock('../emojis/buildkite', () => mockLoadWebpackedEmojis('buildkite'));
jest.mock('../emojis/apple', () => mockLoadWebpackedEmojis('apple'));

const EMOJI_TESTS = [
  ':buildkite:',
  ':wave::skin-tone-3:',
  '👋🏿',
  '👍 :buildkite:',
  '™',
  '👩‍👩‍👧',
  ':woman-woman-girl:',
  '👩🏻‍🏫',
  '🇦🇺💜🇨🇦',
  'String with :rocket:',
  'String with \\:rocket\\:',
  'arn\\:aws\\:s3:::bucket',
  '⛄',
  '💩 in the 💨',
  '©️©',
  '🅱️epis'
];

describe('Emoji', () => {
  describe('parse', () => {
    it('turns emojis into HTML', () => {
      EMOJI_TESTS.forEach((testcase) => {
        expect(Emoji.parse(testcase)).toMatchSnapshot();
      });
    });

    it('allows you to turn off unicode parsing of emojis', () => {
      EMOJI_TESTS.forEach((testcase) => {
        expect(Emoji.parse(testcase, { replaceUnicode: false })).toMatchSnapshot();
      });
    });

    it('escapes other HTML by default', () => {
      expect(Emoji.parse(":tada: <strong>This be strong...</strong>")).toMatchSnapshot();
    });

    it('allows you to turn off HTML escaping', () => {
      expect(Emoji.parse(":tada: <strong>This be strong...</strong>", { escape: false })).toMatchSnapshot();
    });
  });
});
