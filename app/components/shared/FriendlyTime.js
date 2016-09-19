import React from 'react';
import moment from 'moment';
import friendlyRelativeTime from '../../lib/friendlyRelativeTime';

class FriendlyTime extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    capitalized: React.PropTypes.bool.isRequired
  };

  static defaultProps = {
    capitalized: true
  };

  render() {
    const localTimeString = moment(this.props.value).format('LLLL');
    const capitalized = this.props.capitalized;

    return (
      <time dateTime={this.props.value} title={localTimeString}>
        {friendlyRelativeTime(this.props.value, { capitalized })}
      </time>
    );
  }
}

export default FriendlyTime;
