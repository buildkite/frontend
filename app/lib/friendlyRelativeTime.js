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
  const mTime = moment(time);
  const timeString = options.seconds ? mTime.format('h:mm:s A') : mTime.format('h:mm A');

  if (isToday(mTime)) {
    return `${ options.capitalized ? 'Today' : 'today' } at ${ timeString }`;
  } else if (isYesterday(mTime)) {
    return `${ options.capitalized ? 'Yesterday' : 'yesterday' } at ${ timeString }`;
  } else if (isThisYear(mTime)) {
    return `${ mTime.format('ddd Do MMM') } at ${ timeString }`;
  } else {
    return `${ mTime.format('ddd Do MMM YY') } at ${ timeString }`;
  }
}
