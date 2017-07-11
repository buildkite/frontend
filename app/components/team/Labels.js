import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';
import Badge from '../shared/Badge';

class TeamLabels extends React.PureComponent {
  static propTypes = {
    team: PropTypes.shape({
      privacy: PropTypes.string.isRequired,
      isDefaultTeam: PropTypes.bool.isRequired
    })
  }

  render() {
    return (
      <div className="flex ml1">
        {this._renderPrivacyLabel()}
        {this._renderDefaultLabel()}
      </div>
    );
  }

  _renderPrivacyLabel() {
    if (this.props.team.privacy === TeamPrivacyConstants.SECRET) {
      return (
        <Badge outline={true}>Secret</Badge>
      );
    }
  }

  _renderDefaultLabel() {
    if (this.props.team.isDefaultTeam) {
      return (
        <Badge outline={true}>Default</Badge>
      );
    }
  }
}

export default Relay.createContainer(TeamLabels, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        privacy
        isDefaultTeam
      }
    `
  }
});
