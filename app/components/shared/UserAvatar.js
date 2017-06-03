import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class UserAvatar extends React.PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    }).isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    return (
      <img src={this.props.user.avatar.url}
        className={classNames("circle border border-gray bg-white", this.props.className)}
        alt={this.props.user.name}
        title={this.props.user.name}
        style={this.props.style}
      />
    );
  }
}
