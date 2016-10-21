/* global describe, beforeEach, afterEach, jest, it, expect */

const perverseReverse = (str) => str.split('').reverse().join('');

describe(`formatNumber`, function() {
  let window;

  beforeEach(() => {
    jest.mock('global/window', () => window);
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('when the Intl API *is* available', () => {
    let numberFormat;

    beforeEach(() => {
      numberFormat = {
        format: jest.fn((number) => {
          // This is a naïve implementation of number formatting for EN locales
          const numberSplit = (number).toString(10).split('.');

          return perverseReverse(
            numberSplit.shift()
          )
          .match(/\.?([0-9]{1,3})/g)
          .map(perverseReverse)
          .reverse()
          .join(',') + (numberSplit.length ? ('.' + numberSplit.pop().slice(0, 3)) : '');
        })
      };

      window = {
        Intl: {
          NumberFormat: jest.fn(() => numberFormat)
        }
      };
    });

    it('returns a valid, formatted number', () => {
      expect(require('./number').formatNumber(9999)).toBe('9,999');
      expect(require('./number').formatNumber(1234567890.5432)).toBe('1,234,567,890.543');
    });

    it('calls out to `Intl.NumberFormat` and `format`', () => {
      expect(require('./number').formatNumber(1234567890.5432)).toBe('1,234,567,890.543');
      expect(window.Intl.NumberFormat).toHaveBeenCalled();
      expect(numberFormat.format).toHaveBeenCalledWith(1234567890.5432);
    });
  });

  describe('when the Intl API is *not* available', () => {
    beforeEach(() => {
      window = {};
    });

    it('returns a valid, formatted number', () => {
      expect(require('./number').formatNumber(9999)).toBe('9,999');
      expect(require('./number').formatNumber(1234567890.5432)).toBe('1,234,567,890.543');
    });
  });
});
