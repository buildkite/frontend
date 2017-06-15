import escape from 'escape-html';
import BUILDKITE_EMOJI from '../emoji/buildkite';
import UNICODE_EMOJI from '../emoji/apple';

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

    // Start with replacing Buildkite emoji with images
    string = this._replace(string, BUILDKITE_EMOJI, (emoji, { host }) => {
      // Emoji catalogue hosts have a normalized host that always end with a "/"
      const emojiUrl = `${host}${emoji.image}`;

      // Prioritise unicode representation over shortcodes
      const emojiCanonicalRepresentation = emoji.unicode || `:${emoji.name}:`;

      return `<img class="emoji" title="${emoji.name}" alt="${emojiCanonicalRepresentation}" src="${emojiUrl}" draggable="false" />`;
    });

    // Replace Unicode emoji shortcodes with real Unicode
    string = this._replace(string, UNICODE_EMOJI, ({ unicode }) => {
      return unicode;
    });

    return string;
  }

  _replace(string, catalogue, renderer) {
    return string.replace(COLON_REGEXP, (match) => {
      const emojiIndex = catalogue.index[match];

      if ((typeof emojiIndex) === 'number') {
        return renderer(catalogue.emoji[emojiIndex], catalogue);
      }
      return match;

    });
  }
}

export default new Emoji();
