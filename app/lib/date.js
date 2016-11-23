import moment from 'moment';

// gets the clock time formatter
const getTimeFormatter = (withSeconds = false) => (
  `h:mm${withSeconds ? ':ss' : ''} A`
);

// gets the calendar date formatter
const getDateFormatter = (withSeconds = false, withYear = true) => (
  `ddd Do MMM${withYear ? ' YY' : ''} [at] ${getTimeFormatter(withSeconds)}`
);

// gets a friendly, relative date string, optionally with seconds,
// and optionally with relative date names in lowercase
//
// For example:
//   "Today at 12:03 PM"
//   "yesterday at 11:01 AM"
//   "Wed 13 Nov at 1:00 AM"
//   "Fri 1 Jan 2012 at 4:02 PM"
export function getRelativeDateString(time, options = {}) {
  const formats = Object.assign({}, moment.localeData()._calendar);
  const timeFormat = getTimeFormatter(options.seconds);

  if (!options.inPast) {
    formats.lastWeek = formats.lastWeek.replace('[Last] ', '');
    formats.nextWeek = `[Next] ${formats.lastWeek}`;
  }

  formats.sameElse = function(date) {
    return getDateFormatter(options.seconds, this.year() !== moment(date).year());
  };

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

// gets an absolute date string, optionally with seconds
export function getDateString(date, withSeconds = false, withYear = true) {
  return moment(date).format(getDateFormatter(withSeconds, withYear));
}

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
