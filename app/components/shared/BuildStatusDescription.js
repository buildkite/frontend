import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { minute } from 'metrick/duration';
import { getDateString, friendlyRelativeTime } from '../../lib/date';
import { buildStatus } from '../../lib/builds';

class BuildStatusDescription extends React.Component {
  static propTypes = {
    build: React.PropTypes.object.isRequired,
    updateFrequency: React.PropTypes.number.isRequired
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

  componentWillReceiveProps(nextProps) {
    const { build, updateFrequency } = nextProps;

    if (updateFrequency !== this.props.updateFrequency) {
      this.maybeClearInterval();
      this.maybeSetInterval(updateFrequency);
    }

    this.updateBuildInfo(build);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <span>
        {this.state.prefix} <time dateTime={this.state.timeValue} title={this.state.localTimeString}>{friendlyRelativeTime(this.state.timeValue)}</time>
      </span>
    );
  }
}

export default BuildStatusDescription;
