/* global describe, it, expect */
import Emoji from './Emoji';

function loadWebpackedEmojis(catalogue) {
  process.env.EMOJI_HOST = 'emoji-host.com'

  let loader = require('../../webpack/emoji-loader');
  let emojis = require(`../../vendor/emojis/img-${catalogue}-64.json`);
  let webpackContext = {};

  return eval(loader.call(webpackContext, emojis));
}

jest.mock('../emojis/buildkite', () => loadWebpackedEmojis('buildkite'));
jest.mock('../emojis/apple', () => loadWebpackedEmojis('apple'));

describe('Emoji', () => {
  describe('parse', () => {
    it('turns emojis into HTML', () => {
      expect(Emoji.parse(":buildkite:")).toMatchSnapshot();
      expect(Emoji.parse(":wave::skin-tone-3:")).toMatchSnapshot();
      expect(Emoji.parse("👋🏿")).toMatchSnapshot();
    });

    it('allows you to turn of unicode parsing of emojis', () => {
      expect(Emoji.parse("👍 :buildkite:", { replaceUnicode: false })).toMatchSnapshot();
    });

    it('escapes other HTML by default', () => {
      expect(Emoji.parse(":tada: <strong>This be strong...</strong>")).toMatchSnapshot();
    });

    it('allows you to turn off HTML escaping', () => {
      expect(Emoji.parse(":tada: <strong>This be strong...</strong>", { escape: false })).toMatchSnapshot();
    });
  });
});
