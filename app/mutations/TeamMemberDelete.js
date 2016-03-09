import Relay from 'react-relay';

class TeamMemberDelete extends Relay.Mutation {
  static fragments = {
    teamMember: () => Relay.QL`
      fragment on TeamMember {
	id
	team {
	  id
	}
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
	teamMemberDelete
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamMemberDeletePayload {
	deletedTeamMemberID,
	team {
	  members {
	    count
	  }
	}
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'team',
      parentID: this.props.teamMember.team.id,
      connectionName: 'members',
      deletedIDFieldName: 'deletedTeamMemberID'
    }];
  }

  getVariables() {
    return { id: this.props.teamMember.id };
  }
}

export default TeamMemberDelete;
