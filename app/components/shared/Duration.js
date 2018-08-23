// @flow

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { second } from 'metrick/duration';
import moment from 'moment';
import { getDuration, getDurationString } from '../../lib/date';

type Props = {
  from?: (moment$Moment | string | number | Date | number[]),
  to?: (moment$Moment | string | number | Date | number[]),
  className?: string,
  tabularNumerals: boolean,
  format: getDurationString.formats,
  updateFrequency?: number
};

type State = {
  seconds?: number
};

// Grab a copy of the Moment constructor so we can test PropTypes
const Moment = moment().constructor;

class Duration extends React.PureComponent<Props, State> {
  static propTypes = {
    from: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(Moment)
    ]),
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(Moment)
    ]),
    className: PropTypes.string,
    tabularNumerals: PropTypes.bool.isRequired,
    format: PropTypes.oneOf(getDurationString.formats),
    updateFrequency: PropTypes.number
  };

  static defaultProps = {
    updateFrequency: second.bind(1),
    tabularNumerals: true
  };

  _interval: IntervalID;

  state = {};

  updateTime() {
    const { from, to } = this.props;

    this.setState({
      seconds: getDuration(from, to).seconds()
    });
  }

  componentDidMount() {
    this.maybeSetInterval(this.props.updateFrequency);
  }

  maybeSetInterval(updateFrequency) {
    if (!this.props.to && typeof updateFrequency == 'number' && updateFrequency > 0) {
      this._interval = setInterval(() => this.updateTime(), updateFrequency);
    }

    this.updateTime();
  }

  maybeClearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  componentWillUnmount() {
    this.maybeClearInterval();
  }

  static getDerivedStateFromProps(nextProps, currentState) {
    const seconds = getDuration(nextProps.from, nextProps.to).seconds();

    if (seconds !== currentState.seconds) {
      return { seconds };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.updateFrequency !== prevProps.updateFrequency || this.props.to !== prevProps.to) {
      this.maybeClearInterval();
      this.maybeSetInterval(this.props.updateFrequency);
    }
  }

  render() {
    const spanClassName = classNames(
      this.props.className,
      { 'tabular-numerals': this.props.tabularNumerals }
    );

    return (
      <span className={spanClassName}>
        {getDurationString(this.state.seconds, this.props.format)}
      </span>
    );
  }
}

const exported = {};

getDurationString.formats.forEach((format) => {
  const componentName = format.charAt(0).toUpperCase() + format.slice(1);

  const component = (props) => <Duration {...props} format={format} />;
  component.displayName = `Duration.${componentName}`;

  exported[componentName] = component;
});

export default exported;
