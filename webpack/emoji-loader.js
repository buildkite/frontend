// The webpack loader converts the emoji files in
// http://github.com/buildkite/emojis to an indexed version for use in the
// browser.

module.exports = function(source) {
  // Mark this loader as being cacheable
  this.cacheable && this.cacheable();

  // Parse the JSON source
  var source = typeof source === "string" ? JSON.parse(source) : source;

  // Index the emojis
  var emojis = { emojis: [], indexed: {} };
  var index = -1;
  source.forEach(function(emoji) {
    index += 1;

    emojis.emojis.push({ name: emoji["name"], image: emoji["image"] });

    emojis.indexed[emoji["name"]] = index;
    emojis.indexed[emoji["unicode"]] = index;

    emoji["aliases"].forEach(function(alias) {
      emojis.indexed[alias] = index;
    });

    emoji["modifiers"].forEach(function(modifier) {
      index += 1;

      var name = emoji["name"] + "-" + modifier["name"];
      emojis.emojis.push({ name: name, image: modifier["image"] });

      emojis.indexed[name] = index;
      emojis.indexed[modifier["unicode"]] = index;
    });
  });

  // Store the re-parsed emojis
  this.value = [parsed];

  // Re-export the emojis as native code
  return "module.exports = " + JSON.stringify(parsed, undefined, "\t") + ";";
}

