import escape from 'escape-html';
import BUILDKITE_EMOJIS from '../emojis/buildkite';
import APPLE_EMOJIS from '../emojis/apple';

const UNICODE_REGEXP = new RegExp('\\ud83c[\\udf00-\\udfff]|\\ud83d[\\udc00-\\ude4f]|\\ud83d[\\ude80-\\udeff]', 'g');
const COLON_REGEXP = new RegExp('\:[^\\s:]+\:', 'g');

class Emoji {
  parse(string, options = {}) {
    if (!string || string.length === 0) {
      return "";
    }

    // Turn off escaping if the option is explicitly set
    if (options.escape !== false) {
      string = escape(string);
    }

    // Start with replacing BK emojis (which are more likely than Apple emojis)
    string = this._replace(BUILDKITE_EMOJIS, COLON_REGEXP, string);

    // Then do an Apple emoji parse
    string = this._replace(APPLE_EMOJIS, UNICODE_REGEXP, string);
    string = this._replace(APPLE_EMOJIS, COLON_REGEXP, string);

    return string;
  }

  _replace(catalogue, regexp, string) {
    const matches = string.match(regexp);
    const replacements = [];

    // Bail if there aren't any emojis to replace
    if (!matches || !matches.length) {
      return string;
    }

    for (let matchIndex = 0, matchLength = matches.length; matchIndex < matchLength; matchIndex++) {
      const match = matches[matchIndex];
      const nextMatch = matches[matchIndex + 1];

      // See if this match and the next one, makes a new emoji. For example,
      // :fist::skin-tone-4:
      if (nextMatch) {
        const modifiedEmoji = catalogue.indexed[`${match}${nextMatch}`];

        if (modifiedEmoji) {
          replacements.push(this._image(catalogue, modifiedEmoji));
          replacements.push("");
          matchIndex += 1;

          continue;
        }
      }

      const emoji = catalogue.indexed[match];
      if (emoji) {
        replacements.push(this._image(catalogue, emoji));
      } else {
        replacements.push(match);
      }
    }

    return string.replace(regexp, () => replacements.shift());
  }

  _image(catalogue, emoji) {
    // Emoji catalogue hosts have a normalized host that always end with a "/"
    return `<img class="emoji" title="${emoji.name}" alt="${emoji.unicode || emoji.name}" src="${catalogue.host}${emoji.image}" draggable="false" />`;
  }
}

export default new Emoji();
