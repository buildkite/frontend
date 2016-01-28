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
  var source = typeof source === "string" ? JSON.parse(source) : source;

  // Index the emojis
  var emojis = { emojis: [], indexed: {}, host: process.env.EMOJI_HOST };
  var index = -1;
  source.forEach(function(emoji) {
    index += 1;

    emojis.emojis.push({ name: emoji["name"], image: emoji["image"] });

    emojis.indexed[`:${emoji["name"]}:`] = index;
    emojis.indexed[convertToUnicode(emoji["unicode"])] = index;

    emoji["aliases"].forEach(function(alias) {
      emojis.indexed[`:${alias}:`] = index;
    });

    emoji["modifiers"].forEach(function(modifier) {
      index += 1;

      emojis.emojis.push({ name: emoji["name"], image: modifier["image"] });

      emojis.indexed[`:${emoji["name"]}::${modifier["name"]}:`] = index;
      emojis.indexed[convertToUnicode(modifier["unicode"])] = index;

      emoji["aliases"].forEach(function(alias) {
        emojis.indexed[`:${alias}::${modifier["name"]}:`] = index;
      });
    });
  });

  // Store the newly sorted emojis
  this.value = [emojis];

  // Re-export the emojis as native code
  return "module.exports = " + JSON.stringify(emojis, undefined, "\t") + ";";
}
