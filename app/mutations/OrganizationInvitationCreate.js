import Relay from 'react-relay/classic';

export default class OrganizationInvitationCreate extends Relay.Mutation {
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
        organizationInvitationCreate
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on OrganizationInvitationCreatePayload {
        organization {
          id
          invitations {
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
          fragment on OrganizationInvitationCreatePayload {
            organization {
              invitations {
                count
              }
            }
          }
        `
      ]
    }];
  }

  getVariables() {
    return {
      organizationID: this.props.organization.id,
      emails: this.props.emails,
      teams: this.props.teams,
      role: this.props.role,
      sso: this.props.sso
    };
  }
}
