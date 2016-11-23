import moment from 'moment';

const TIME_SPANS = [
  'week',
  'day',
  'hour',
  'minute',
  'second'
];

const FULL_RENDERER = ({ amount, label }) => `${amount} ${label}${amount === 1 ? '' : 's'}`;
const SHORT_RENDERER = ({ amount, label }) => `${amount}${label[0]}`;

const DATE_FORMATS = {
  'full': {
    length: 3,
    commas: true,
    render: FULL_RENDERER
  },
  'short': {
    length: 2,
    commas: false,
    render: SHORT_RENDERER
  },
  'micro': {
    length: 1,
    commas: false,
    render: SHORT_RENDERER
  }
};

export function getDurationString(from, to = moment(), format = 'full', overrides = { }) {
  if (getDurationString.formats.indexOf(format) === -1) {
    throw new Error(`getDurationString: Unknown format \`${format}\`.`);
  }

  const configuration = Object.assign({}, DATE_FORMATS[format], overrides);

  const duration = moment.duration(moment(to).diff(from));

  const times = [];

  TIME_SPANS.forEach((label, index, labels) => {
    let amount;

    if (times.length === 0) {
      // the first one needs to take into account all larger units
      amount = Math.floor(duration.as(label));
    } else {
      // the rest work fine as Moment defines them
      amount = duration.get(label);
    }

    // disallow negative values
    amount = Math.max(amount, 0);

    // the last label is always supplied, even if it's 0
    if (amount > 0 || index === labels.length - 1) {
      times.push({ amount, label });
    }
  });

  // only keep the most significant digits
  const displayedTimes = times.slice(0, configuration.length);

  if (displayedTimes.length < times.length) {
    // let's round the last item using the next item we'd have shown
    const lastTime = displayedTimes[displayedTimes.length - 1];
    const nextTime = times[displayedTimes.length];

    lastTime.amount = Math.round(
      moment
        .duration(lastTime.amount, lastTime.label)
        .add(nextTime.amount, nextTime.label)
        .as(lastTime.label)
    );
  }

  return displayedTimes.map(configuration.render).join(configuration.commas ? ', ' : ' ');
}

getDurationString.formats = Object.keys(DATE_FORMATS);

// Returns a friendly, relative version of a timestamp.
//
// For example:
//   "Today at 12:03 PM"
//   "Yesterday at 11:01 AM"
//   "Wed 13 Nov at 1:00 AM"
//   "Fri 1 Jan 2012 at 4:02 PM"
export function friendlyRelativeTime(time, options = {}) {
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
