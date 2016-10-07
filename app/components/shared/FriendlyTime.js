import React from 'react';
import moment from 'moment';
import friendlyRelativeTime from '../../lib/friendlyRelativeTime';

class FriendlyTime extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    capitalized: React.PropTypes.bool.isRequired,
    seconds: React.PropTypes.bool.isRequired
  };

  static defaultProps = {
    capitalized: true,
    seconds: false
  };

  render() {
    const { value, capitalized, seconds } = this.props;

    const localTimeString = moment(value).format('LLLL');

    return (
      <time dateTime={value} title={localTimeString}>
        {friendlyRelativeTime(this.props.value, { capitalized, seconds })}
      </time>
    );
  }
}

export default FriendlyTime;
