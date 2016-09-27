// The webpack loader converts the emoji files in
// http://github.com/buildkite/emojis to an indexed version for use in the
// browser.
//
// The exported hash from this loader looks like this:
//
// {
//   host: "http://assets.buildkite.com/emojis",
//   emojis: [ { name: "smiley", image: "img-apple-64/1f603.png", unicode: "😃" } ],
//   indexed: {
//     "😃": { name: "smiley", image: "img-apple-64/1f603.png", unicode: "😃" },
//     ":smiley:": { name: "smiley", image: "img-apple-64/1f603.png", unicode: "😃" },
//     ":smiley::skin-tone-4:": { name: "smiley", image: "img-apple-64/1f603.png", unicode: "😃" }
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
    this.emitError("ERROR: No EMOJI_HOST set, can't load emojis");
    throw new Error("Failed to load emojis");
  }

  // Parse the JSON source
  source = typeof source === "string" ? JSON.parse(source) : source;

  // Normalize the host (should always end with a "/")
  if (host.slice(-1) !== "/") {
    host = host + "/";
  }

  // Index the emojis
  var emojiData = { emojis: [], indexed: {}, host: host };

  source.forEach(function(emoji) {
    var item = { name: emoji["name"], image: emoji["image"] };

    emojiData.emojis.push(item);

    var emojiUnicode = convertToUnicode(emoji["unicode"]);

    if (emojiUnicode) {
      item.unicode = emojiUnicode;
      emojiData.indexed[emojiUnicode] = item;
    }

    emojiData.indexed[`:${emoji["name"]}:`] = item;

    emoji["aliases"].forEach(function(alias) {
      emojiData.indexed[`:${alias}:`] = item;
    });

    var modifiers = emoji["modifiers"];
    if (modifiers && modifiers.length > 0) {
      modifiers.forEach(function(modifier) {
        var modified = { name: emoji["name"], image: modifier["image"] };

        emojiData.emojis.push(modified);

        var modifierUnicode = convertToUnicode(modifier["unicode"]);

        if (modifierUnicode) {
          modified.unicode = modifierUnicode;
          emojiData.indexed[modifierUnicode] = modified;
        }

        emojiData.indexed[`:${emoji["name"]}::${modifier["name"]}:`] = modified;

        emoji["aliases"].forEach(function(alias) {
          emojiData.indexed[`:${alias}::${modifier["name"]}:`] = modified;
        });
      });
    }
  });

  // Store the newly sorted emojis
  this.value = [emojiData];

  // Re-export the emojis as native code
  return "module.exports = " + JSON.stringify(emojiData, undefined, "\t") + ";";
};
