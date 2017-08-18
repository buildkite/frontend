import React from 'react';
import PropTypes from 'prop-types';
import { minute } from 'metrick/duration';
import { getDateString, getRelativeDateString } from '../../lib/date';

export default class FriendlyTime extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    updateFrequency: PropTypes.number.isRequired,
    capitalized: PropTypes.bool.isRequired,
    className: PropTypes.string,
    seconds: PropTypes.bool.isRequired
  };

  static defaultProps = {
    updateFrequency: 1::minute,
    capitalized: true,
    seconds: false
  };

  state = {
    value: ''
  };

  updateTime() {
    const { value, capitalized, seconds } = this.props;

    this.setState({
      value: getRelativeDateString(value, { capitalized, seconds })
    });
  }

  componentDidMount() {
    this.maybeSetInterval(this.props.updateFrequency);
  }

  maybeSetInterval(updateFrequency) {
    if (updateFrequency > 0) {
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
    const { value, capitalized, seconds, updateFrequency } = nextProps;

    if (updateFrequency !== this.props.updateFrequency) {
      this.maybeClearInterval();
      this.maybeSetInterval(updateFrequency);
    }

    this.setState({
      value: getRelativeDateString(value, { capitalized, seconds })
    });
  }

  render() {
    return (
      <time
        className={this.props.className}
        dateTime={this.props.value}
        title={getDateString(this.props.value, true)}
      >
        {this.state.value}
      </time>
    );
  }
}
