import window from 'global/window';

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
