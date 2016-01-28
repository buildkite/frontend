const APPLE_EMOJIS = require("!!./../../webpack/emoji-loader!./../../vendor/emojis/img-apple-64.json");
const BUILDKITE_EMOJIS = require("!!./../../webpack/emoji-loader!./../../vendor/emojis/img-buildkite-64.json");

const UNICODE_REGEXP = new RegExp('\\ud83c[\\udf00-\\udfff]|\\ud83d[\\udc00-\\ude4f]|\\ud83d[\\ude80-\\udeff]', 'g');
const COLON_REGEXP = new RegExp('\:[^\\s:]+\:', 'g');

class Emoji {
  parse(string, options = {}) {
    if(!string || !string.length) {
      return "";
    }

    // Start with replacing BK emojis (which are more likely than Apple emojis)
    string = this._replace(BUILDKITE_EMOJIS, COLON_REGEXP, string);

    // Then do an Apple emoji parse
    string = this._replace(APPLE_EMOJIS, UNICODE_REGEXP, string);
    string = this._replace(APPLE_EMOJIS, COLON_REGEXP, string);

    return string;
  }

  _replace(catalogue, regexp, string) {
    let matches = string.match(regexp);
    let replacements = [];

    // Bail if there aren't any emojis to replace
    if(!matches || !matches.length) {
      return string;
    }

    for(let i = 0, l = matches.length; i < l; i++) {
      let match = matches[i];
      let nextMatch = matches[i+1];

      // See if this match and the next one, makes a new emoji. For example,
      // :fist::skin-tone-4:
      if(nextMatch) {
        let matchWithModifier = `${match}${nextMatch}`
        let modifiedEmojiIndex = catalogue.indexed[matchWithModifier];

        if(modifiedEmojiIndex) {
          replacements.push(this._image(catalogue, modifiedEmojiIndex));
          replacements.push("");
          i += 1
        }
      }

      let emojiIndex = catalogue.indexed[match];

      if(emojiIndex) {
        replacements.push(this._image(catalogue, emojiIndex));
      } else {
        replacements.push(match);
      };
    };

    return string.replace(regexp, (match) => {
      return replacements.shift();
    });
  }

  _image(catalogue, index) {
    let emoji = catalogue.emojis[index];

    return `<img class="emoji" title="${emoji.name}" alt="${emoji.name}" src="${catalogue.host}/${emoji.image}" height="20" width="20" align="absmiddle" />`
  }
}

export default new Emoji();
