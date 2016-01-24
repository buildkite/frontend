const APPLE_EMOJIS = require("!!./../../webpack/emoji-loader!./../../vendor/emojis/img-apple-64.json");
const BUILDKITE_EMOJIS = require("!!./../../webpack/emoji-loader!./../../vendor/emojis/img-buildkite-64.json");

const UNICODE_REGEXP = new RegExp('\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]', 'g');
const COLON_REGEXP = new RegExp('\:[^\\s:]+\:', 'g');

class Emoji {
  parse(string) {
    console.log(string);
    // console.log(APPLE_EMOJIS);
    // console.log(BUILDKITE_EMOJIS);
  }
}

export default new Emoji();
