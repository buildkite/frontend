import Relay from 'react-relay/compat';

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
          sso {
            mode
          }
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
    const variables = {
      id: this.props.organizationMember.id,
      role: this.props.role
    };

    if (this.props.sso) {
      variables.sso = this.props.sso;
    }

    return variables;
  }
}
