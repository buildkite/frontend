// @flow

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { second } from 'metrick/duration';
import moment from 'moment';
import { getDurationString } from '../../lib/date';

type Props = {
  from?: (moment$Moment | string | number | Date | number[]),
  to?: (moment$Moment | string | number | Date | number[]),
  className?: string,
  tabularNumerals: boolean,
  format: getDurationString.formats,
  updateFrequency?: number
};

type State = {
  value: string
};

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

  state = {
    value: ''
  };

  updateTime() {
    const { from, to, format } = this.props;

    this.setState({
      value: getDurationString(from, to, format)
    });
  }

  componentDidMount() {
    this.maybeSetInterval(this.props.updateFrequency);
  }

  maybeSetInterval(updateFrequency) {
    if (typeof updateFrequency == 'number' && updateFrequency > 0) {
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

  componentWillReceiveProps(nextProps) {
    const { from, to, format, updateFrequency } = nextProps;

    if (updateFrequency !== this.props.updateFrequency) {
      this.maybeClearInterval();
      this.maybeSetInterval(updateFrequency);
    }

    this.setState({
      value: getDurationString(from, to, format)
    });
  }

  render() {
    const { state: { value }, props: { className, tabularNumerals } } = this;
    const spanClassName = classNames(
      className,
      { 'tabular-numerals': tabularNumerals }
    );

    return (
      <span className={spanClassName}>
        {value}
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
