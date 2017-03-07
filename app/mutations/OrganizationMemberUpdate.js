import Relay from 'react-relay';

export default class OrganizationMemberUpdate extends Relay.Mutation {
  static fragments = {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        organizationMemberUpdate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on OrganizationMemberUpdatePayload {
        organizationMember {
          role
          user {
            name
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        organizationMember: this.props.organizationMember.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.organizationMember.id, role: this.props.role };
  }
}
