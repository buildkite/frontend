// @flow

// dasherize("SomeStringTesting") will return some-string-testing
export default function dasherize(string: ?string) {
  if (string) {
    return string.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/\-+/g, "-").replace(/^\-/g, "").replace(/\-$/, "");
  }
}
