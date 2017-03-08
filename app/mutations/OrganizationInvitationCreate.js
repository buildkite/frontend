import Relay from 'react-relay';

import OrganizationMemberRoleConstants from '../constants/OrganizationMemberRoleConstants';

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
        invitationEdges {
          node {
            role
            user {
              name
            }
          }
        }
      }
    `;
  }

  getOptimisticResponse() {
    return {
      organizationInvitationEdge: {
        node: {
          role: OrganizationMemberRoleConstants.MEMBER
        }
      }
    };
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'organization',
      parentID: this.props.organization.id,
      connectionName: 'invitations',
      edgeName: 'organizationInvitationEdge',
      rangeBehaviors: () => 'prepend'
    }];
  }

  getVariables() {
    return {
      id: this.props.organizationMember.id,
      emails: this.props.emails,
      role: this.props.role
    };
  }
}
