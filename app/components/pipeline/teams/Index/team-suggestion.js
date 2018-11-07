import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import TeamLabels from 'app/components/team/Labels';
import Emojify from 'app/components/shared/Emojify';

class TeamSuggestion extends React.PureComponent {
  static displayName = "Pipeline.Teams.TeamSuggestion";

  static propTypes = {
    team: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
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

export default Relay.createContainer(TeamSuggestion, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        name
        description
        slug
        ${TeamLabels.getFragment('team')}
      }
    `
  }
});
