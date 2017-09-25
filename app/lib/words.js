// @flow

const VOWELS = 'aeiou';

export const indefiniteArticleFor = (word: string): string => {
  const first = ('' + word).toLowerCase()[0];

  return VOWELS.indexOf(first) !== -1
    ? 'an'
    : 'a';
};
