// The webpack loader converts the emoji files in
// http://github.com/buildkite/emojis to an indexed version for use in the
// browser.
//
// The exported hash from this loader looks like this:
//
// {
//   host: "http://assets.buildkite.com/emojis"
//   emojis: [ { name: "smiley", image: "img-buildkite-64/smiley.png" } ],
//   indexed: {
//     ":smiley:": 0,
//     ":smiling": 0,
//     ":smiley::skin-tone-4:": 0,
//     "\u43f3g: 0
//   }
// }
//
// The value of the indexed hash referes to the emojis index in the `emojis`
// array.
//
// Emoji unicode values, names and aliased are all indexed.

function convertToUnicode(code) {
  if(!code || !code.length) {
    return null;
  }

  var points = [];
  code.split("-").forEach(function(p) {
    points.push("0x" + p);
  });

  return String.fromCodePoint.apply(String, points);
}

module.exports = function(source) {
  // Mark this loader as being cacheable
  this.cacheable && this.cacheable();

  // Parse the JSON source
  source = typeof source === "string" ? JSON.parse(source) : source;

  // Get the emoji host and throw and error if it's missing
  var host = process.env.EMOJI_HOST
  if(!host) {
    this.emitError("ERROR: No EMOJI_HOST set, can't load emojis");
    throw new Error("Failed to load emojis");
  }

  // Normalize the host (should always end with a "/")
  if(host.slice(-1) != "/") {
    host = host + "/";
  }

  // Index the emojis
  var emojis = { emojis: [], indexed: {}, host: host };
  source.forEach(function(emoji) {
    var item = { name: emoji["name"], image: emoji["image"] };

    emojis.emojis.push(item);

    emojis.indexed[`:${emoji["name"]}:`] = item;
    emojis.indexed[convertToUnicode(emoji["unicode"])] = item;

    emoji["aliases"].forEach(function(alias) {
      emojis.indexed[`:${alias}:`] = item;
    });

    var modifiers = emoji["modifiers"];
    if(modifiers && modifiers.length > 0) {
      modifiers.forEach(function(modifier) {
        var modified = { name: emoji["name"], image: modifier["image"] };

        emojis.indexed[`:${emoji["name"]}::${modifier["name"]}:`] = modified;
        emojis.indexed[convertToUnicode(modifier["unicode"])] = modified;

        emoji["aliases"].forEach(function(alias) {
          emojis.indexed[`:${alias}::${modifier["name"]}:`] = modified;
        });
      });
    }
  });

  // Store the newly sorted emojis
  this.value = [emojis];

  // Re-export the emojis as native code
  return "module.exports = " + JSON.stringify(emojis, undefined, "\t") + ";";
}
