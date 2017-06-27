const range = (minOrCount, maybeCount) => (
  Array.apply(null, Array(typeof maybeCount === 'number' ? maybeCount : minOrCount))
    .map((nothing, index) => (
      index + (typeof maybeCount === 'number' ? minOrCount : 0)
    ))
);

const spliceWordFragments = (names) => (
  names.reduce(
    (acc, key) => (
      acc.concat(key
        .replace(/([a-z])([A-Z])/g, (match, first, second) => `${first}_${second}`)
        .replace(/([A-Z]+)([A-Z][a-z])/g, (match, first, second) => `${first}_${second}`)
        .replace(/^on/, '')
        .split(/[_-]/))
        .filter((fragment) => !!fragment)
    ),
    []
  )
  .filter((fragment, index, array) => (
    array.indexOf(fragment) === index
  ))
);

const keys = [].concat(
  Object.keys(window),
  Object.keys(window.location),
  Object.keys(window.navigator)
);

const words = spliceWordFragments(keys);

window.words = words;

export default function garbage(length = (Math.round(Math.random() * 10) + 1)) {
  return range(1, length)
    .reduce(
      (acc) => {
        let newWord = words[Math.round(Math.random() * words.length)];
        const word = `${newWord[0][acc ? 'toUpperCase' : 'toLowerCase']()}${newWord.slice(1)}`;
        return `${acc}${word}`
      },
      ''
    );
}
