import Relay from 'react-relay/compat';

export default class OrganizationMemberDelete extends Relay.Mutation {
  static fragments = {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        id
        organization {
          id
        }
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        organizationMemberDelete
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on OrganizationMemberDeletePayload {
        deletedOrganizationMemberID
        user {
          id
        }
        organization {
          slug
          members {
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
          fragment on OrganizationMemberDeletePayload {
            user {
              id
            }
            organization {
              members {
                count
              }
            }
          }
        `
      ]
    }, {
      type: 'NODE_DELETE',
      parentName: 'organization',
      parentID: this.props.organizationMember.organization.id,
      connectionName: 'members',
      deletedIDFieldName: 'deletedOrganizationMemberID'
    }];
  }

  getVariables() {
    return { id: this.props.organizationMember.id };
  }
}
