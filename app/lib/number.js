import window from 'global/window';

// Formats numbers nicely based on their current locale
// e.g. 4200000 -> 4,200,000
export const formatNumber = (
  (window.Intl && window.Intl.NumberFormat)
    ? ((formatter, number) => (
        formatter.format(number)
      )).bind(this, window.Intl.NumberFormat())
    : (number) => (
        number.toLocaleString
          ? number.toLocaleString()
          : number
      )
);
