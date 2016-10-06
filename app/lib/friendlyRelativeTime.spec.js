/* global describe, it, expect */
import MockDate from 'mockdate';
import friendlyRelativeTime from './friendlyRelativeTime';

const DATE_FIXTURES = [
  "2016-05-07T09:00:00.000Z",
  "2016-05-07T16:45:16.000Z",
  "2016-05-07T20:59:03.000Z",
  "2016-05-08T16:03:21.000Z",
  "2016-05-21T01:22:12.000Z",
  "2016-07-10T04:34:17.000Z",
  "2018-01-01T04:34:17.000Z"
];

const BOOL_FIXTURES = [
  undefined,
  true,
  false
];

const runDateFixtureSpecs = (options) => (() => {
  DATE_FIXTURES.forEach((date) => {
    it(`renders a correct time in the past or present`, () => {
      MockDate.set(date);
      expect(friendlyRelativeTime(DATE_FIXTURES[0], options)).toMatchSnapshot();
      MockDate.reset();
    });

    it(`renders a correct time in the future`, () => {
      MockDate.set(DATE_FIXTURES[0]);
      expect(friendlyRelativeTime(date, options)).toMatchSnapshot();
      MockDate.reset();
    });
  });
})

describe('friendlyRelativeTime', () => {
  BOOL_FIXTURES.forEach((seconds) => {
    BOOL_FIXTURES.forEach((capitalized) => {
      describe(`when supplied with options=\`{ seconds: ${seconds}, capitalized: ${capitalized} }\``, runDateFixtureSpecs({seconds, capitalized}));
    });
  });

  describe(`when supplied with options=undefined`, runDateFixtureSpecs());
});
