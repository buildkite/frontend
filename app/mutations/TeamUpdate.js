import Relay from 'react-relay';

class TeamUpdate extends Relay.Mutation {
  static fragments = {
    team: () => Relay.QL`
      fragment on Team {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        teamUpdate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamUpdatePayload {
        team {
          name
          slug
          description
          privacy
          isDefaultTeam
          defaultMemberRole
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        team: this.props.team.id
      }
    }];
  }

  getVariables() {
    return {
      id: this.props.team.id,
      name: this.props.name,
      description: this.props.description,
      privacy: this.props.privacy,
      isDefaultTeam: this.props.isDefaultTeam,
      defaultMemberRole: this.props.defaultMemberRole
    };
  }
}

export default TeamUpdate;
