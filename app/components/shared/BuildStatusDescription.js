import React from 'react';
import PropTypes from 'prop-types';
import { minute } from 'metrick/duration';
import { getDateString, getRelativeDateString } from 'app/lib/date';
import { buildStatus } from 'app/lib/builds';

class BuildStatusDescription extends React.PureComponent {
  static propTypes = {
    build: PropTypes.object.isRequired,
    updateFrequency: PropTypes.number.isRequired
  };

  static defaultProps = {
    updateFrequency: 1::minute
  };

  state = {
    timeValue: ''
  };

  updateBuildInfo(build) {
    const status = buildStatus(build);

    this.setState({
      localTimeString: getDateString(status.timeValue),
      ...status
    });
  }

  componentDidMount() {
    this.maybeSetInterval(this.props.updateFrequency);
  }

  maybeSetInterval(updateFrequency) {
    if (updateFrequency > 0) {
      this._interval = setInterval(() => this.updateBuildInfo(this.props.build), updateFrequency);
    }
    this.updateBuildInfo(this.props.build);
  }

  maybeClearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  componentWillUnmount() {
    this.maybeClearInterval();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { build, updateFrequency } = nextProps;

    if (updateFrequency !== this.props.updateFrequency) {
      this.maybeClearInterval();
      this.maybeSetInterval(updateFrequency);
    }

    this.updateBuildInfo(build);
  }

  render() {
    return (
      <span>
        {this.state.prefix} <time dateTime={this.state.timeValue} title={this.state.localTimeString}>{getRelativeDateString(this.state.timeValue)}</time>
      </span>
    );
  }
}

export default BuildStatusDescription;
