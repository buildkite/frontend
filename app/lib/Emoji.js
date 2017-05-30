import escape from 'escape-html';
import emojiRegex from 'emoji-regex';
import BUILDKITE_EMOJI from '../emojis/buildkite';
import UNICODE_EMOJI from '../emojis/apple';

const UNICODE_REGEXP = emojiRegex();
const COLON_REGEXP = /:[^\s:]+:(?::skin-tone-[2-6]:)?/g;

class Emoji {
  parse(string, options = {}) {
    if (!string || string.length === 0) {
      return '';
    }

    // Turn off escaping if the option is explicitly set
    if (options.escape !== false) {
      string = escape(string);
    }

    // Start with replacing BK emoji (which are more likely than Unicode emoji)
    string = this._replace(string, COLON_REGEXP, BUILDKITE_EMOJI);

    // Then do a Unicode emoji parse
    if (options.replaceUnicode !== false) {
      string = this._replace(string, UNICODE_REGEXP, UNICODE_EMOJI);
    }

    string = this._replace(string, COLON_REGEXP, UNICODE_EMOJI);

    return string;
  }

  _replace(string, regexp, catalogue) {
    return string.replace(regexp, (match) => {
      const emojiIndex = catalogue.index[match];

      if ((typeof emojiIndex) === 'number') {
        return this._render(catalogue, catalogue.emoji[emojiIndex]);
      } else {
        return match;
      }
    });
  }

  _render({ host }, emoji) {
    // Emoji catalogue hosts have a normalized host that always end with a "/"
    const emojiUrl = `${host}${emoji.image}`;

    // Prioritise unicode representation over shortcodes
    const emojiCanonicalRepresentation = emoji.unicode || `:${emoji.name}:`;

    return `<img class="emoji" title="${emoji.name}" alt="${emojiCanonicalRepresentation}" src="${emojiUrl}" draggable="false" />`;
  }
}

export default new Emoji();
