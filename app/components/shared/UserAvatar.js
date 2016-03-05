import React from 'react';
import classNames from 'classnames';

const UserAvatar = (props) =>
  <img src={props.user.avatar.url} className={classNames("circle", props.className)}
       alt={props.user.name}
       style={props.style} />

UserAvatar.propTypes = {
  user: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    avatar: React.PropTypes.shape({
      url: React.PropTypes.string.isRequired
    })
  }),
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default UserAvatar;
