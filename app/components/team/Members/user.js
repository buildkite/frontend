import React from 'react';
import PropTypes from 'prop-types';

import User from '../../shared/User';

export default class TeamMembersUser extends React.PureComponent {
  static displayName = "Team.Members.User";

  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        url: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <User user={this.props.user} />
    );
  }
}
