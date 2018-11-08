/* global describe, it, expect */
import moment from 'moment';
import MockDate from 'mockdate';
import { getDateString, getDuration, getDurationString, getRelativeDateString } from './date';

const BOOL_FIXTURES = [
  undefined,
  true,
  false
];

const runDateFixtureSpecs = (method, ...args) => (() => {
  [
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
    .map((date) => moment.parseZone(date))
    .forEach((date, index, list) => {
      it(`renders a correct time in the past or present (now: ${date.format()}, date: ${list[0].format()})`, () => {
        MockDate.set(date);
        expect(method(list[0], ...args)).toMatchSnapshot();
        MockDate.reset();
      });

      it(`renders a correct time in the future (now: ${list[0].format()}, date: ${date.format()})`, () => {
        MockDate.set(list[0]);
        expect(method(date, ...args)).toMatchSnapshot();
        MockDate.reset();
      });
    });
});

describe('getRelativeDateString', () => {
  BOOL_FIXTURES.forEach((seconds) => {
    BOOL_FIXTURES.forEach((capitalized) => {
      BOOL_FIXTURES.forEach((inPast) => {
        const options = { seconds, capitalized, inPast };
        describe(
          `when supplied with options=\`${JSON.stringify(options)}\``,
          runDateFixtureSpecs(getRelativeDateString, options)
        );
      });
    });
  });

  describe(`when supplied with options=\`undefined\``, runDateFixtureSpecs(getRelativeDateString));
});

describe('getDateString', () => {
  BOOL_FIXTURES.forEach((withSeconds) => {
    describe(`when supplied with withSeconds=${withSeconds}`, () => {
      runDateFixtureSpecs(getDateString, withSeconds);
    });
  });
});

const DURATION_FIXTURES = [
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-07T09:00:00.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-07T09:00:05.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-07T09:15:07.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-07T10:45:16.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-07T13:59:03.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-08T16:03:21.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-05-21T01:22:12.000+10:00" },
  { from: "2016-05-07T09:00:00.000+10:00", to: "2016-07-10T04:34:17.000+10:00" },
  { from: "2017-01-17T08:57:30.994-08:00", to: "2017-02-01T17:28:11.712-08:00" },
  { from: "2017-01-17T17:28:11.000-08:00", to: "2017-01-17T17:28:12.712-08:00" },
  { from: undefined, to: undefined },
  { from: undefined, to: "2016-10-06T08:10:25.000+10:00" },
  { from: undefined, to: "2016-10-06T08:09:55.000+10:00" },
  { from: undefined, to: "2016-10-06T08:09:25.000+10:00" }
];

describe('getDuration', () => {
  DURATION_FIXTURES.forEach(({ from, to }) => {
    it(`when given \`${from}\` and \`${to}\``, () => {
      expect(getDuration(from, to)).toMatchSnapshot();
    });
  });

  it('falls back to `now` when not supplied a `to` value', () => {
    MockDate.set("2016-10-06T08:10:25.000+10:00");
    expect(getDuration("2016-10-05T03:40:02.000+10:00")).toMatchSnapshot();
    expect(getDuration("2016-10-05T03:40:02.000+10:00", undefined)).toMatchSnapshot();
    expect(getDuration(undefined, undefined)).toMatchSnapshot();
    MockDate.reset();
  });
});

describe('getDurationString', () => {
  describe('formats', () => {
    it('are supplied as an array', () => {
      expect(getDurationString.formats).toBeInstanceOf(Array);
      expect(getDurationString.formats.length).toMatchSnapshot();
    });
  });

  it('defaults to full dates', () => {
    expect(getDurationString(getDuration("2016-10-05T03:39:57.000+10:00", "2016-10-05T03:40:02.000+10:00"))).toMatchSnapshot();
  });

  getDurationString.formats.map((format) => {
    describe(`correctly handles \`${format}\` dates`, () => {
      DURATION_FIXTURES.forEach(({ from, to }) => {
        describe(`when given \`${from}\` and \`${to}\``, () => {
          it(`and no format override`, () => {
            expect(getDurationString(getDuration(from, to), format)).toMatchSnapshot();
          });
        });
      });
    });
  });

  it('falls back to `now` when not supplied a `to` value', () => {
    MockDate.set("2016-10-06T08:10:25.000+10:00");
    expect(getDurationString(getDuration("2016-10-05T03:40:02.000+10:00"))).toMatchSnapshot();
    expect(getDurationString(getDuration("2016-10-05T03:40:02.000+10:00", undefined), "short")).toMatchSnapshot();
    expect(getDurationString(getDuration(undefined, undefined), "short")).toMatchSnapshot();
    MockDate.reset();
  });

  it('throws if supplied with an unknown format', () => {
    expect(() => getDurationString(getDuration("2016-10-05T03:40:02.000+10:00", "2016-10-05T03:40:02.000+10:00"), "not-a-date-format")).toThrowErrorMatchingSnapshot();
  });
});
