// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'intersection-observer';
import VisibilityObserver from 'react-intersection-observer';
import { second } from 'metrick/duration';
import moment from 'moment';
import { getDuration, getDurationString } from 'app/lib/date';

type DurationFormats = 'full' | 'medium' | 'short' | 'micro';

type Props = {
  from?: (moment$Moment | string | number | Date | number[]),
  to?: (moment$Moment | string | number | Date | number[]),
  className?: string,
  tabularNumerals: boolean,
  format: DurationFormats,
  updateFrequency?: number
};

type State = {
  seconds?: number
};

// Grab a copy of the Moment constructor so we can test PropTypes
const Moment = moment().constructor;

function makeDurationFormat(format: DurationFormats) {
  const Component = (props: Props) => <Duration {...props} format={format} />;
  Component.displayName = format.charAt(0).toUpperCase() + format.slice(1);
  return Component;
}

export default class Duration extends React.PureComponent<Props, State> {
  static Full = makeDurationFormat('full');
  static Medium = makeDurationFormat('medium');
  static Short = makeDurationFormat('short');
  static Micro = makeDurationFormat('micro');

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

  _timeout: TimeoutID;

  state = {};

  tick() {
    const { from, to } = this.props;
    const seconds = getDuration(from, to).asSeconds();

    this.setState({ seconds }, this.maybeScheduleTick);
  }

  componentDidMount() {
    this.maybeScheduleTick();
  }

  maybeScheduleTick() {
    const { from, to, updateFrequency } = this.props;

    // We only want to schedule ticks if our duration is indeterminate,
    // and our update frequency isn't zero
    if (!(from && to) && typeof updateFrequency == 'number' && updateFrequency > 0) {
      this._timeout = setTimeout(() => {
        this.tick();
      }, updateFrequency);
    }
  }

  maybeCancelTick() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  componentWillUnmount() {
    this.maybeCancelTick();
  }

  static getDerivedStateFromProps(nextProps, currentState) {
    const seconds = getDuration(nextProps.from, nextProps.to).asSeconds();

    if (seconds !== currentState.seconds) {
      return { seconds };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const { updateFrequency, to } = this.props;

    if (updateFrequency !== prevProps.updateFrequency || to !== prevProps.to) {
      this.maybeCancelTick();
      this.maybeScheduleTick();
    }
  }

  handleVisibilityChange = (visible) => {
    this.maybeCancelTick();

    if (visible) {
      this.tick();
    }
  }

  render() {
    const spanClassName = classNames(
      this.props.className,
      { 'tabular-numerals': this.props.tabularNumerals }
    );

    const durationString = getDurationString(this.state.seconds, this.props.format);

    if (this.props.to) {
      return (
        <span className={spanClassName}>
          {durationString}
        </span>
      );
    }

    return (
      <VisibilityObserver
        tag="span"
        className={spanClassName}
        onChange={this.handleVisibilityChange}
      >
        {durationString}
      </VisibilityObserver>
    );
  }
}
