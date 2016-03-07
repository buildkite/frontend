import React from 'react';
import moment from 'moment';
import { friendlyRelativeTime } from '../../lib/friendlyRelativeTime';

class FriendlyTime extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    capitalized: React.PropTypes.bool
  };

  render() {
    let localTimeString = moment(this.props.value).format('LLLL');

    return (
      <time dateTime={this.props.value} title={localTimeString}>
        {friendlyRelativeTime(this.props.value, {capitalized: true})}
      </time>
    );
  }
}

export default FriendlyTime;
