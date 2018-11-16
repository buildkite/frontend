/* global jest, describe, it, expect, beforeEach */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-multi-spaces */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import Duration from './Duration';

jest.mock('react-intersection-observer', () => ({ children }) => <div>{children}</div>);

describe('Duration', () => {
  describe('formats', () => {
    const formats = [
      ['Full',   new Date("1986-08-28T06:00:00"), new Date("1986-08-28T07:01:01"), '1 hour, 1 minute, 1 second'],
      ['Full',   new Date("1986-08-28T06:00:00"), new Date("1986-08-28T08:02:02"), '2 hours, 2 minutes, 2 seconds'],
      ['Medium', new Date("1986-08-28T06:00:00"), new Date("1986-08-28T07:01:01"), '1 hour'],
      ['Medium', new Date("1986-08-28T06:00:00"), new Date("1986-08-28T08:01:01"), '2 hours'],
      ['Short',  new Date("1986-08-28T06:00:00"), new Date("1986-08-28T07:01:01"), '1h 1m'],
      ['Micro',  new Date("1986-08-28T06:00:00"), new Date("1986-08-28T07:01:01"), '1h']
    ];
    describe.each(formats)('Duration.%s', (format, from, to, expected) => {
      const DurationFormat = Duration[format];
      const props = { from, to, updateFrequency: 0 };

      it('renders', () => {
        expect.assertions(2);

        const rendered = ReactTestRenderer.create(<DurationFormat {...props} />);
        expect(rendered.root.findByType('span').children).toEqual([expected]);
        expect(rendered.root.findByType('span').props).toHaveProperty('className', 'tabular-numerals');
      });

      describe('tabularNumerals', () => {
        it('can be disabled', () => {
          expect.assertions(2);

          const rendered = ReactTestRenderer.create(<DurationFormat {...props} tabularNumerals={false} />);
          expect(rendered.root.findByType('span').children).toEqual([expected]);
          expect(rendered.root.findByType('span').props).toHaveProperty('className', '');
        });
      });
    });
  });

  describe('updateFrequency', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('sets an interval if supplied with a frequency greater than zero', () => {
      expect.assertions(4);

      const now = Date.now();
      const from = new Date(now);

      const rendered = ReactTestRenderer.create(<Duration.Full from={from} updateFrequency={1000} />);
      expect(rendered.root.findByType('div').children).toEqual(['0 seconds']);
      jest.spyOn(Date, 'now').mockImplementation(() => now + 1000);
      jest.advanceTimersByTime(1000);
      expect(rendered.root.findByType('div').children).toEqual(['1 second']);
      jest.spyOn(Date, 'now').mockImplementation(() => now + 2000);
      jest.advanceTimersByTime(1000);
      expect(rendered.root.findByType('div').children).toEqual(['2 seconds']);
      jest.spyOn(Date, 'now').mockImplementation(() => now + 200000);
      jest.advanceTimersByTime(1000);
      expect(rendered.root.findByType('div').children).toEqual(['3 minutes, 20 seconds']);
    });

    it('sets no interval if supplied with a frequency of zero', () => {
      expect.assertions(2);

      const now = Date.now();
      const from = new Date(now);

      const rendered = ReactTestRenderer.create(<Duration.Full from={from} updateFrequency={0} />);
      expect(rendered.root.findByType('div').children).toEqual(['0 seconds']);
      jest.spyOn(Date, 'now').mockImplementation(() => now + 1000);
      jest.advanceTimersByTime(1000);
      expect(rendered.root.findByType('div').children).toEqual(['0 seconds']);
    });
  });
});
