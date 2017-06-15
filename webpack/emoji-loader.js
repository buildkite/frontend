// The webpack loader converts the emoji files in
// http://github.com/buildkite/emojis to an indexed version for use in the
// browser.
//
// The exported hash from this loader looks like this:
//
// {
//   host: "http://assets.buildkite.com/emojis",
//   emoji: [ { name: "smiley", image: "img-apple-64/1f603.png", unicode: "😃" } ],
//   index: {
//     "😃": 0,
//     ":smiley:": 0,
//     ":smiley::skin-tone-4:": 0
//   }
// }
//
// Emoji unicode values, names and aliases are all indexed.

function convertToUnicode(code) {
  if (!code || !code.length) {
    return null;
  }

  var points = code.split("-").map((point) => `0x${point}`);

  return String.fromCodePoint.apply(String, points);
}

module.exports = function(source) {
  // Mark this loader as being cacheable
  this.cacheable && this.cacheable();

  // Get the emoji host and throw and error if it's missing
  var host = process.env.EMOJI_HOST;
  if (!host) {
    this.emitError("ERROR: No EMOJI_HOST set, can't load emoji");
    throw new Error("Failed to load emoji");
  }

  // Parse the JSON source
  source = typeof source === "string" ? JSON.parse(source) : source;

  // Normalize the host (should always end with a "/")
  if (host.slice(-1) !== "/") {
    host = host + "/";
  }

  // Index the emoji
  var emojiList = [];
  var emojiIndex = {};

  source.forEach(function(emoji) {
    var item = {
      name: emoji["name"]
    };

    emojiList.push(item);
    var itemIndex = emojiList.indexOf(item);

    var emojiUnicode = convertToUnicode(emoji["unicode"]);

    if (emojiUnicode) {
      item.unicode = emojiUnicode;
    } else {
      item.image = emoji["image"];
    }

    emojiIndex[`:${emoji["name"]}:`] = itemIndex;

    emoji["aliases"].forEach(function(alias) {
      emojiIndex[`:${alias}:`] = itemIndex;
    });

    var modifiers = emoji["modifiers"];
    if (modifiers && modifiers.length > 0) {
      modifiers.forEach(function(modifier) {
        var modified = {
          name: emoji["name"]
        };

        emojiList.push(modified);
        var modifiedIndex = emojiList.indexOf(modified);

        var modifierUnicode = convertToUnicode(modifier["unicode"]);

        if (modifierUnicode) {
          modified.unicode = modifierUnicode;
        } else {
          modified.image = modifier["image"];
        }

        emojiIndex[`:${emoji["name"]}::${modifier["name"]}:`] = modifiedIndex;

        emoji["aliases"].forEach(function(alias) {
          emojiIndex[`:${alias}::${modifier["name"]}:`] = modifiedIndex;
        });
      });
    }
  });

  var emojiData = { emoji: emojiList, index: emojiIndex, host: host };

  // Store the newly sorted emoji
  this.value = [emojiData];

  // Re-export the emoji as native code
  return "module.exports = " + JSON.stringify(emojiData, undefined, "\t") + ";";
};
