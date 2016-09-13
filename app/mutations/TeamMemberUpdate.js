import Relay from 'react-relay';

class TeamMemberUpdate extends Relay.Mutation {
  static fragments = {
    teamMember: () => Relay.QL`
      fragment on TeamMember {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        teamMemberUpdate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamMemberUpdatePayload {
        teamMember {
          admin
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        teamMember: this.props.teamMember.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.teamMember.id, admin: this.props.admin };
  }
}

export default TeamMemberUpdate;
