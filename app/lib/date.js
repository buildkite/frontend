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

export function getDurationString(from, to = moment(), format = 'full') {
  if (getDurationString.formats.indexOf(format) === -1) {
    throw new Error(`getDurationString: Unknown format \`${format}\`.`);
  }

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
  const displayedTimes = times.slice(0, DATE_FORMATS[format].length);

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

  return displayedTimes.map(DATE_FORMATS[format].render).join(DATE_FORMATS[format].commas ? ', ' : ' ');
}

getDurationString.formats = Object.keys(DATE_FORMATS);
