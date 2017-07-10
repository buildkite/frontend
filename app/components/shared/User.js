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
    align: PropTypes.oneOf(['left', 'right']).isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    align: 'left'
  };

  render() {
    let content = [
      <div
        key="avatar"
        className={classNames("flex-none", {
          'icon-mr': this.props.align === 'left',
          'icon-ml': this.props.align === 'right'
        })}
        style={{ width: 39, height: 39 }}
      >
        <UserAvatar
          user={this.props.user}
          className="fit"
        />
      </div>,
      <div
        key="text"
        className={classNames("flex-auto overflow-hidden", {
          'right-align': this.props.align === 'right'
        })}
      >
        <strong
          className="truncate semi-bold block"
          title={this.props.user.name}
        >
          {this.props.user.name}
        </strong>
        <small
          className="truncate dark-gray block"
          title={this.props.user.email}
        >
          {this.props.user.email}
        </small>
      </div>
    ];

    if (this.props.align === 'right') {
      content = content.reverse();
    }

    return (
      <div
        className={classNames("flex", this.props.className)}
        style={this.props.style}
      >
        {content}
      </div>
    );
  }
};

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
