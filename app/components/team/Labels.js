import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

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
        <div className="ml1 regular small border border-gray rounded dark-gray p1 line-height-1">Secret</div>
      );
    }
  }

  _renderDefaultLabel() {
    if (this.props.team.isDefaultTeam) {
      return (
        <div className="ml1 regular small border border-gray rounded dark-gray p1 line-height-1">Default</div>
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
