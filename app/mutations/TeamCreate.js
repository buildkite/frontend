import Relay from 'react-relay/classic';

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
        teamCreate
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
      children: [
        Relay.QL`
          fragment on TeamCreatePayload {
            teamEdge {
              node {
                slug
                organization {
                  teams {
                    count
                  }
                }
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
      rangeBehaviors: () => 'ignore'
    }];
  }

  getVariables() {
    return {
      organizationID: this.props.organization.id,
      name: this.props.name,
      description: this.props.description,
      privacy: this.props.privacy,
      isDefaultTeam: this.props.isDefaultTeam,
      defaultMemberRole: this.props.defaultMemberRole
    };
  }
}

export default TeamCreate;
