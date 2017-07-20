const VOWELS = 'aeiou';

export const indefiniteArticleFor = (word) => {
  const first = ('' + word).toLowerCase()[0];

  if (!first) {
    return;
  }

  return VOWELS.indexOf(first) !== -1
    ? 'an'
    : 'a';
};
