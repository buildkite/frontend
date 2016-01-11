import React from 'react';

class UserAvatar extends React.Component {
  static propTypes = {
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      avatar: React.PropTypes.shape({
	url: React.PropTypes.string.isRequired
      })
    }),
    size: React.PropTypes.number.isRequired
  };

  render() {
    let style = {
      width: this.props.size,
      height: this.props.size
    };

    return (
      <img src={this.props.user.avatar.url} className="UserAvatarComponent" alt={this.props.user.name} style={style} />
    );
  }
}

export default UserAvatar;
