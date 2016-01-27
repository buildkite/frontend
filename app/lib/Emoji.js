const APPLE_EMOJIS = require("!!./../../webpack/emoji-loader!./../../vendor/emojis/img-apple-64.json");
const BUILDKITE_EMOJIS = require("!!./../../webpack/emoji-loader!./../../vendor/emojis/img-buildkite-64.json");

const UNICODE_REGEXP = new RegExp('\\ud83c[\\udf00-\\udfff]|\\ud83d[\\udc00-\\ude4f]|\\ud83d[\\ude80-\\udeff]', 'g');
const COLON_REGEXP = new RegExp('\:[^\\s:]+\:', 'g');

class Emoji {
  parse(string, options = {}) {
    return this._replaceUnicode(this._replaceColons(string));
  }

  _replaceColons(string) {
    return string.replace(COLON_REGEXP, (match) => {
      let name = match.substr(1, match.length-2);
      let index = APPLE_EMOJIS.indexed[name];

      if(index) {
        return this._image(APPLE_EMOJIS, index);
      } else {
        return match;
      }
    });
  }

  _replaceUnicode(string) {
    return string.replace(UNICODE_REGEXP, (match) => {
      let index = APPLE_EMOJIS.indexed[match];

      if(index) {
        return this._image(APPLE_EMOJIS, index);
      } else {
        return match;
      }
    });
  }

  _image(catalogue, index) {
    let emoji = catalogue.emojis[index];

    return `<img class="emoji" title="${emoji.name}" alt="${emoji.name}" src="${catalogue.host}/${emoji.image}" height="20" width="20" align="absmiddle" />`
  }
}

export default new Emoji();
