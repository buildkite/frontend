export const indefiniteArticleFor = (word) => {
  const first = (''+word).toLowerCase()[0];

  if (!first) {
    return;
  }

  return 'aeiou'.split('').indexOf(first) !== -1
    ? 'an'
    : 'a';
};
