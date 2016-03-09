import Relay from 'react-relay';

class TeamMemberCreate extends Relay.Mutation {
  static fragments = {
    team: () => Relay.QL`
      fragment on Team {
	id
        members {
          count
        }
      }
    `,
    user: () => Relay.QL`
      fragment on User {
	id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
	teamMemberCreate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamMemberCreatePayload {
	teamMemberEdge,
	team {
	  members {
	    count
	  }
	}
      }
    `;
  }

  getOptimisticResponse() {
    return {
      teamMemberEdge: {
        node: {
          user: this.props.user,
          admin: false
        }
      },
      team: {
        members: {
          count: this.props.team.members.count + 1
        }
      }
    };
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'team',
      parentID: this.props.team.id,
      connectionName: 'members',
      edgeName: 'teamMemberEdge',
      rangeBehaviors: {
	'': 'append'
      }
    }];
  }

  getVariables() {
    return { teamID: this.props.team.id, userID: this.props.user.id };
  }
}

export default TeamMemberCreate;
