/* global describe, it, expect */
import moment from 'moment';
import MockDate from 'mockdate';
import friendlyRelativeTime from './friendlyRelativeTime';

const DATE_FIXTURES = [
  "2016-05-07T09:00:00.000+10:00",
  "2016-05-07T16:45:16.000+10:00",
  "2016-05-07T20:59:03.000+10:00",
  "2016-05-08T16:03:21.000+10:00",
  "2016-05-10T18:11:05.000+12:00",
  "2016-05-14T18:11:05.000+10:00",
  "2016-05-21T01:22:12.000-14:00",
  "2016-07-10T04:34:17.000+08:00",
  "2018-01-01T04:34:17.000-07:00"
]
.map((date) => moment.parseZone(date));

const BOOL_FIXTURES = [
  undefined,
  true,
  false
];

const runDateFixtureSpecs = (options) => (() => {
  DATE_FIXTURES.forEach((date) => {
    it(`renders a correct time in the past or present (now: ${date.format()}, date: ${DATE_FIXTURES[0].format()})`, () => {
      MockDate.set(date);
      expect(friendlyRelativeTime(DATE_FIXTURES[0], options)).toMatchSnapshot();
      MockDate.reset();
    });

    it(`renders a correct time in the future (now: ${DATE_FIXTURES[0].format()}, date: ${date.format()})`, () => {
      MockDate.set(DATE_FIXTURES[0]);
      expect(friendlyRelativeTime(date, options)).toMatchSnapshot();
      MockDate.reset();
    });
  });
});

describe('friendlyRelativeTime', () => {
  BOOL_FIXTURES.forEach((seconds) => {
    BOOL_FIXTURES.forEach((capitalized) => {
      BOOL_FIXTURES.forEach((inPast) => {
        const options = { seconds, capitalized, inPast };
        describe(
          `when supplied with options=\`${JSON.stringify(options)}\``,
          runDateFixtureSpecs(options)
        );
      });
    });
  });

  describe(`when supplied with options=\`undefined\``, runDateFixtureSpecs());
});
