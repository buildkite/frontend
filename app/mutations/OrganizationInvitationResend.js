import Relay from 'react-relay';

export default class OrganizationInvitationResend extends Relay.Mutation {
  static fragments = {
    organizationInvitation: () => Relay.QL`
      fragment on OrganizationInvitation {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        organizationInvitationResend
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on OrganizationInvitationResendPayload {
        organizationInvitation {
          id
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        organizationInvitation: this.props.organizationInvitation.id
      }
    }];
  }

  getVariables() {
    return { id: this.props.organizationInvitation.id };
  }
}
