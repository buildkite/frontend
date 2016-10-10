import moment from 'moment';

// Returns a friendly, relative version of a timestamp.
//
// For example:
//   "Today at 12:03 PM"
//   "Yesterday at 11:01 AM"
//   "Wed 13 Nov at 1:00 AM"
//   "Fri 1 Jan 2012 at 4:02 PM"
export default function friendlyRelativeTime(time, options = {}) {
  const formats = Object.assign({}, moment.localeData()._calendar);
  const timeFormat = `h:mm${options.seconds ? ':ss' : ''} A`;

  if (!options.inPast) {
    formats.lastWeek = formats.lastWeek.replace('[Last] ', '');
    formats.nextWeek = `[Next] ${formats.lastWeek}`;
  }

  formats.sameElse = function(date) {return `ddd Do MMM${this.year() === moment(date).year() ? '' : ' YY'} [at] ${timeFormat}`;};

  if (!options.capitalized) {
    Object.keys(formats).forEach((calendarString) => {
      if ((typeof formats[calendarString]) === 'string') {
        formats[calendarString] = formats[calendarString]
          .replace(/\[[^\]]+\]/g, (replacement) => replacement.toLowerCase())
          .replace('LT', timeFormat);
      }
    });
  }

  return moment(time).calendar(moment(), formats);
}
