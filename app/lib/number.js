// @flow

import window from 'global/window';

// Formats numbers nicely based on their current locale
// e.g. 4200000 -> 4,200,000
export const formatNumber = (
  (window.Intl && window.Intl.NumberFormat)
    ? ((formatter, number: number): string => (
        formatter.format(number)
      )).bind(this, window.Intl.NumberFormat())
    : (number: number): string => (
        number.toLocaleString
          ? number.toLocaleString()
          : number.toString()
      )
);
