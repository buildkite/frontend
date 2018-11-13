import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

import TeamLabels from 'app/components/team/Labels';
import Emojify from 'app/components/shared/Emojify';

class Team extends React.PureComponent {
  static displayName = "Member.Edit.TeamMemberships.Chooser.Team";

  static propTypes = {
    team: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <div>
        <div className="flex items-center">
          <Emojify text={this.props.team.name} className="semi-bold truncate" />
          <TeamLabels team={this.props.team} />
        </div>
        <div className="m0 p0 dark-gray truncate"><Emojify text={this.props.team.description || "n/a"} /></div>
      </div>
    );
  }
}

export default Relay.createContainer(Team, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        name
        description
        ${TeamLabels.getFragment('team')}
      }
    `
  }
});
