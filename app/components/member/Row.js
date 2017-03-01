import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';

import OrganizationMemberRoleConstants from '../../constants/OrganizationMemberRoleConstants';

const AVATAR_SIZE = 40;

class MemberRow extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    organizationMember: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      role: React.PropTypes.string.isRequired,
      user: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        avatar: React.PropTypes.shape({
          url: React.PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Panel.RowLink key={this.props.organizationMember.uuid} to={`/organizations/${this.props.organization.slug}/users/${this.props.organizationMember.uuid}/edit`}>
        <div className="flex flex-stretch items-center">
          <div className="flex flex-none mr2">
            <UserAvatar
              user={this.props.organizationMember.user}
              className="align-middle"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
          </div>
          <div className="flex-auto">
            <div className="m0 semi-bold">
              {this.props.organizationMember.user.name}
              {this.props.organizationMember.role === OrganizationMemberRoleConstants.ADMIN && <span className="dark-gray regular h6 ml1">Administrator</span>}
            </div>
            <div className="h6 regular mt1">{this.props.organizationMember.user.email}</div>
          </div>
        </div>
      </Panel.RowLink>
    );
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
