/* global describe, it, expect */
import { indefiniteArticleFor } from './words';

const TEST_WORDS = [
  'pipeline',
  'organization',
  'request',
  'dog',
  'cat',
  'ant',
  'clock'
];

describe('indefiniteArticleFor', () => {
  describe('correctly identifies indefinite articles', () => {
    TEST_WORDS.forEach((word) => {
      it(`for “${word}”`, () => {
        const articleForWord = indefiniteArticleFor(word);
        const articleForUppercaseWord = indefiniteArticleFor(word.toUpperCase());

        expect(articleForWord).toMatchSnapshot();
        expect(articleForUppercaseWord).toMatchSnapshot();
        expect(articleForWord).toEqual(articleForUppercaseWord);
      });
    });
  });
});
