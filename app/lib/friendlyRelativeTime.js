import moment from 'moment';

const CALENDAR_LOCALE_STRINGS_TO_LOWERCASE = [
  'lastDay',
  'sameDay',
  'nextDay'
];

// Returns a friendly, relative version of a timestamp.
//
// For example:
//   "Today at 12:03 PM"
//   "Yesterday at 11:01 AM"
//   "Wed 13 Nov at 1:00 AM"
//   "Fri 1 Jan 2012 at 4:02 PM"
export default function friendlyRelativeTime(time, options = {}) {
  const formats = {
    sameElse: function(date) {return `ddd Do MMM${this.year() === moment(date).year() ? '' : ' YY'} [at] h:mm${options.seconds ? ':ss' : ''} A`;},
    lastWeek: function() {return `${options.inPast ? '[last] ' : ''}dddd [at] LT`;},
    nextWeek: function() {return `${options.inPast ? '' : '[next] '}dddd [at] LT`;}
  };

  if (options.capitalized !== true) {
    CALENDAR_LOCALE_STRINGS_TO_LOWERCASE.forEach((calendarString) => {
      formats[calendarString] = moment.localeData().calendar([calendarString]).replace(/\[[^\]]+\]/g, (replacement) => replacement.toLowerCase());
    });
  }

  return moment(time).calendar(moment(), formats);
}
