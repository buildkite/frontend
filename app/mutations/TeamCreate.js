import Relay from 'react-relay';

class TeamCreate extends Relay.Mutation {
  static fragments = {
    organization: () => Relay.QL`
      fragment on Organization {
	id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
	createTeam
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TeamCreatePayload {
	teamEdge,
	organization {
	  teams {
	    count
	  }
	}
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      // Forces these fragments to be included in the query
      children: [
	Relay.QL`
	fragment on TeamCreatePayload {
	  teamEdge {
	    node {
	      slug
	    }
	  }
	}
	`
      ]
    }, {
      type: 'RANGE_ADD',
      parentName: 'organization',
      parentID: this.props.organization.id,
      connectionName: 'teams',
      edgeName: 'teamEdge',
      rangeBehaviors: {
	'': 'append'
      }
    }];
  }

  getVariables() {
    return { organizationID: this.props.organization.id, name: this.props.name, description: this.props.description };
  }
}

export default TeamCreate
