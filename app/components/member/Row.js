import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';
import Badge from '../shared/Badge';

import OrganizationMemberRoleConstants from '../../constants/OrganizationMemberRoleConstants';
import OrganizationMemberSSOModeConstants from '../../constants/OrganizationMemberSSOModeConstants';

const AVATAR_SIZE = 40;

class MemberRow extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      slug: PropTypes.string.isRequired
    }).isRequired,
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      sso: PropTypes.shape({
        mode: PropTypes.string
      }).isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          url: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.RowLink key={this.props.organizationMember.uuid} to={`/organizations/${this.props.organization.slug}/users/${this.props.organizationMember.uuid}`}>
        <div className="flex flex-stretch items-center">
          <div className="flex flex-none mr2">
            <UserAvatar
              user={this.props.organizationMember.user}
              className="align-middle"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
          </div>
          <div className="flex-auto">
            <div className="m0 flex items-center semi-bold">
              {this.props.organizationMember.user.name}
              {this.renderLabels()}
            </div>
            <div className="h6 regular mt1">{this.props.organizationMember.user.email}</div>
          </div>
        </div>
      </Panel.RowLink>
    );
  }

  renderLabels() {
    const nodes = [];

    if (this.props.organizationMember.sso.mode === OrganizationMemberSSOModeConstants.OPTIONAL) {
      nodes.push(
        <div key={1} className="flex ml1">
          <Badge outline={true} className="regular">SSO Optional</Badge>
        </div>
      );
    }

    if (this.props.organizationMember.role === OrganizationMemberRoleConstants.ADMIN) {
      nodes.push(
        <div key={2} className="flex ml1">
          <Badge outline={true} className="regular">Administrator</Badge>
        </div>
      );
    }

    return nodes;
  }
}

export default Relay.createContainer(MemberRow, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        role
        sso {
          mode
        }
        user {
          name
          email
          avatar {
            url
          }
        }
      }
    `
  }
});
