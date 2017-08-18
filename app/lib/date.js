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
  } else {
    Object.keys(formats).forEach((calendarString) => {
      if ((typeof formats[calendarString]) === 'string') {
        formats[calendarString] = formats[calendarString]
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
      // the first one needs to take into account all larger units,
      // otherwise we'd  end up with results not taking into account
      // units larger than the largest unit in `TIME_SPANS`
      amount = duration.as(label);
    } else {
      // further time spans do not require the above consideration
      amount = duration.get(label);
    }

    // disallow negative values
    amount = Math.max(amount, 0);

    // the last label is always supplied, even if it's 0
    if (Math.floor(amount) > 0 || index === labels.length - 1) {
      times.push({ amount, label });
    }
  });

  // if we have more than one time span, we need to do some processing, because
  //  a) the first time span will _include_ some smaller time spans
  //  b) we'll need to include discarded time spans in the last time span
  // otherwise, if we only have a single time span, we can rely on the value
  // returned as the first index by `Moment#as`
  if (times.length > 1) {
    const firstTime = times[0];

    if (configuration.length > 1) {
      // if we're accepting more than one time span, we need to subtract the
      // second most significant span from the most significant time span, then
      // floor it, as the most significant span include smaller time spans.

      const secondTime = times[1];

      firstTime.amount = Math.floor(
        moment
          .duration(firstTime.amount, firstTime.label)
          .subtract(secondTime.amount, secondTime.label)
          .as(firstTime.label)
      );
    } else {
      // otherwise, we simply round the first time span
      firstTime.amount = Math.round(firstTime.amount);
    }

    // if the first time span is now zero, we can ignore it, and the next time
    // span does not require the same processing it did
    if (firstTime.amount < 1) {
      times.shift();
    }

    // if we still have data we're discarding, let's add the first discarded
    // item to the last shown item and round the result
    if (configuration.length < times.length && configuration.length > 1) {
      const lastTime = times[configuration.length - 1];
      const nextTime = times[configuration.length];

      lastTime.amount = Math.round(
        moment
          .duration(lastTime.amount, lastTime.label)
          .add(nextTime.amount, nextTime.label)
          .as(lastTime.label)
      );
    }
  } else {
    times[0].amount = Math.round(times[0].amount);
  }

  return times
    // only keep the most significant digits
    .slice(0, configuration.length)
    .map(configuration.render)
    .join(
      configuration.commas
        ? ', '
        : ' '
    );
}

getDurationString.formats = Object.keys(DATE_FORMATS);
