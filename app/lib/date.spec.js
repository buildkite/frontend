/* global describe, it, expect */
import MockDate from 'mockdate';
import { getDurationString } from './date';

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
      expect(getDurationString("2016-10-05T03:39:57.000Z", "2016-10-05T03:40:02.000Z", format)).toMatchSnapshot();
      expect(getDurationString("2016-09-15T06:49:27.000Z", "2016-09-15T06:52:55.000Z", format)).toMatchSnapshot();
      expect(getDurationString("2016-09-15T06:49:27.000Z", "2016-09-15T08:52:55.000Z", format)).toMatchSnapshot();
    });
  });

  it('falls back to `now` when not supplied a `to` value', () => {
    MockDate.set("2016-10-09T08:10:25.000Z");
    expect(getDurationString("2016-10-05T03:40:02.000Z")).toMatchSnapshot();
    expect(getDurationString("2016-10-05T03:40:02.000Z", undefined, "short")).toMatchSnapshot();
    MockDate.reset();
  });
});
