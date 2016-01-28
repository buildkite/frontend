import React from 'react';
import classNames from 'classnames';

class UserAvatar extends React.Component {
  static propTypes = {
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      avatar: React.PropTypes.shape({
        url: React.PropTypes.string.isRequired
      })
    }),
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    return (
      <img src={this.props.user.avatar.url} className={classNames("circle", this.props.className)}
           alt={this.props.user.name}
           style={this.props.style} />
    );
  }
}

export default UserAvatar;
