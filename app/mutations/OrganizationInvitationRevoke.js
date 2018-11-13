import Relay from 'react-relay/compat';

export default class OrganizationInvitationRevoke extends Relay.Mutation {
  static fragments = {
    organizationInvitation: () => Relay.QL`
      fragment on OrganizationInvitation {
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
        organizationInvitationRevoke
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on OrganizationInvitationRevokePayload {
        organizationInvitationEdge
        organization {
          invitations
        }
        organizationInvitation {
          email
          revokedAt
          revokedBy
          state
        }
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          organizationInvitation: this.props.organizationInvitation.id
        }
      },
      {
        type: 'RANGE_ADD',
        parentName: 'organization',
        parentID: this.props.organizationInvitation.organization.id,
        connectionName: 'invitations',
        edgeName: 'organizationInvitationEdge',
        rangeBehaviors: {
          'state(PENDING)': 'remove'
        }
      }
    ];
  }

  getVariables() {
    return { id: this.props.organizationInvitation.id };
  }
}
