import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

import UserAvatar from './UserAvatar';

class User extends React.PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        url: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    className: PropTypes.string,
    inheritHoverColor: PropTypes.bool.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    inheritHoverColor: false
  };

  render() {
    return (
      <div
        className={classNames("flex", this.props.className)}
        style={this.props.style}
      >
        <div
          key="avatar"
          className="flex-none icon-mr"
          style={{ width: 39, height: 39 }}
        >
          <UserAvatar
            user={this.props.user}
            className="fit"
            style={{ width: 38, height: 38 }}
          />
        </div>
        <div
          key="text"
          className="flex-auto flex flex-column overflow-hidden justify-center"
        >
          <strong
            className="truncate semi-bold"
            title={this.props.user.name}
          >
            {this.props.user.name}
          </strong>
          <small
            className={classNames("truncate dark-gray", { "hover-color-inherit": this.props.inheritHoverColor })}
            title={this.props.user.email}
          >
            {this.props.user.email}
          </small>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(User, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        name
        email
        avatar {
          url
        }
      }
    `
  }
});
