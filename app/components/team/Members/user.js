import React from 'react';

import UserAvatar from '../../shared/UserAvatar';

export default class User extends React.PureComponent {
  static displayName = "Team.Members.User";

  static propTypes = {
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired,
      avatar: React.PropTypes.shape({
        url: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <div className="flex">
        <div className="flex-none icon-mr" style={{ width: 39, height: 39 }} >
          <UserAvatar user={this.props.user} className="fit" />
        </div>
        <div className="flex-auto overflow-hidden">
          <strong className="truncate semi-bold block" title={this.props.user.name}>{this.props.user.name}</strong>
          <small className="truncate dark-gray block" title={this.props.user.email}>{this.props.user.email}</small>
        </div>
      </div>
    );
  }
}
