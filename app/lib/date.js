import moment from 'moment';

export function getDurationString(from, to = moment(), format = 'full') {
  if (getDurationString.formats.indexOf(format) === -1) {
    throw new Error(`getDurationString: Unknown format \`${format}\`.`);
  }

  const diff = moment(to).diff(from);

  const duration = moment.duration(diff);

  const hours = duration.get('hours');
  const minutes = duration.get('minutes');
  const seconds = duration.get('seconds');

  let times = [];

  if (hours > 0) {
    times.push([hours, "hour"]);
  }

  if (minutes > 0) {
    times.push([minutes, "minute"]);
  }

  if (seconds > 0) {
    times.push([seconds, "second"]);
  }

  if (times.length === 0) {
    times.push([0, "second"]);
  }

  if (format === "short") {
    times = times.slice(0, 2);
    // TODO: Rount next significant span
  }

  if (format === "micro") {
    times = times.slice(0, 1);
    // TODO: Rount next significant span
  }

  return times
    .map(([amount, label]) => {
      if (format === "full") {
        return `${amount} ${label}${amount === 1 ? '' : 's'}`;
      } else {
        return `${amount}${label[0]}`;
      }
    })
    .join(format === "full" ? ', ' : ' ');
}

getDurationString.formats = [
  'full',
  'short',
  'micro'
];
