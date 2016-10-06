import moment from 'moment';

function isToday(momentTime) {
  const now = moment();
  return momentTime.isSame(now, 'day');
}

function isYesterday(momentTime) {
  const yesterday = moment().subtract(1, 'days');
  return momentTime.isSame(yesterday, 'day');
}

function isThisYear(momentTime) {
  const now = moment();
  return momentTime.isSame(now, 'year');
}

// Returns a friendly, relative version of a timestamp.
//
// For example:
//   "Today at 12:03 PM"
//   "Yesterday at 11:01 AM"
//   "Wed 13 Nov at 1:00 AM"
//   "Fri 1 Jan 2012 at 4:02 PM"
export default function friendlyRelativeTime(time, options = {}) {
  const momentTime = moment(time);
  const timeString = momentTime.format(`h:mm${options.seconds ? ':ss' : ''} A`);
  let dateString = momentTime.format(`ddd Do MMM${isThisYear(momentTime) ? '' : ' YY'}`);

  if (isToday(momentTime)) {
    dateString = options.capitalized ? 'Today' : 'today';
  } else if (isYesterday(momentTime)) {
    dateString = options.capitalized ? 'Yesterday' : 'yesterday';
  }

  return `${dateString} at ${timeString}`;
}
