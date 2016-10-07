import React from 'react';
import moment from 'moment';
import friendlyRelativeTime from '../../lib/friendlyRelativeTime';

class FriendlyTime extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    updateFrequency: React.PropTypes.number.isRequired,
    capitalized: React.PropTypes.bool.isRequired,
    seconds: React.PropTypes.bool.isRequired
  };

  static defaultProps = {
    updateFrequency: 60000,
    capitalized: true,
    seconds: false
  };

  state = {
    value: ''
  };

  updateTime() {
    const { value, capitalized, seconds } = this.props;

    this.setState({
      value: friendlyRelativeTime(value, { capitalized, seconds })
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
      value: friendlyRelativeTime(value, { capitalized, seconds })
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value || nextProps.capitalized !== this.props.capitalized || nextProps.seconds !== this.props.seconds || nextState.value !== this.state.value;
  }

  render() {
    const localTimeString = moment(this.props.value).format('LLLL');

    return (
      <time dateTime={this.props.value} title={localTimeString}>
        {this.state.value}
      </time>
    );
  }
}

export default FriendlyTime;
