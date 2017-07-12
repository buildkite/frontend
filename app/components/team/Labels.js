import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';
import Badge from '../shared/Badge';

class TeamLabels extends React.PureComponent {
  static propTypes = {
    team: PropTypes.shape({
      privacy: PropTypes.string.isRequired
    })
  }

  render() {
    if (this.props.team.privacy === TeamPrivacyConstants.SECRET) {
      return (
        <div className="flex ml1">
          <Badge outline={true}>Secret</Badge>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Relay.createContainer(TeamLabels, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        privacy
      }
    `
  }
});
