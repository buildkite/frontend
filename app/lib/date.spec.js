/* global describe, it, expect */
import MockDate from 'mockdate';
import { getDurationString } from './date';

const DATE_FIXTURES = [
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T09:00:00.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T09:00:05.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T09:15:07.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T10:45:16.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T13:59:03.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-08T16:03:21.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-21T01:22:12.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-07-10T04:34:17.000Z" }
];

describe('getDurationString', () => {
  describe('formats', () => {
    it('are supplied as an array', () => {
      expect(getDurationString.formats).toBeInstanceOf(Array);
      expect(getDurationString.formats.length).toMatchSnapshot();
    });
  });

  it('defaults to full dates', () => {
    expect(getDurationString("2016-10-05T03:39:57.000Z", "2016-10-05T03:40:02.000Z")).toMatchSnapshot();
  });

  getDurationString.formats.map((format) => {
    it(`correctly handles \`${format}\` dates`, () => {
      DATE_FIXTURES.forEach(({ from, to }) => {
        expect(getDurationString(from, to, format)).toMatchSnapshot();
      });
    });
  });

  it('falls back to `now` when not supplied a `to` value', () => {
    MockDate.set("2016-10-06T08:10:25.000Z");
    expect(getDurationString("2016-10-05T03:40:02.000Z")).toMatchSnapshot();
    expect(getDurationString("2016-10-05T03:40:02.000Z", undefined, "short")).toMatchSnapshot();
    MockDate.reset();
  });

  it('throws if supplied with an unknown format', () => {
    expect(() => getDurationString("2016-10-05T03:40:02.000Z", "2016-10-05T03:40:02.000Z", "not-a-date-format")).toThrowErrorMatchingSnapshot();
  });
});
