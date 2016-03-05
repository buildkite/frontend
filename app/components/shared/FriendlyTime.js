import React from 'react';
import moment from 'moment';
import { friendlyRelativeTime } from '../../lib/friendlyRelativeTime';

const FriendlyTime = (props) => {
  let localTimeString = moment(props.value).format('LLLL');

  return (
    <time dateTime={props.value} title={localTimeString}>
      {friendlyRelativeTime(props.value, {capitalized: true})}
    </time>
  );
}

FriendlyTime.propTypes = {
  value: React.PropTypes.string.isRequired,
  capitalized: React.PropTypes.bool
};

export default FriendlyTime;
