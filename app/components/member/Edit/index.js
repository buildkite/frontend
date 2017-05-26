import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PageHeader from '../../shared/PageHeader';
import UserAvatar from '../../shared/UserAvatar';

import MemberEditRole from './role';
import MemberEditRemove from './remove';
import MemberEditTeamMemberships from './team-memberships';

const AVATAR_SIZE = 50;

class Edit extends React.PureComponent {
  static displayName = "Member.Edit";

  static propTypes = {
    viewer: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        permissions: PropTypes.shape({
          teamAdmin: PropTypes.shape({
            allowed: PropTypes.bool.isRequired
          }).isRequired
        }).isRequired
      }).isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          url: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    })
  };

  render() {
    if (!this.props.organizationMember) {
      return null;
    }

    const isSelf = this.props.organizationMember.user.id === this.props.viewer.user.id;

    let memberEditTeamMemberships = null;
    if (this.props.organizationMember.organization.permissions.teamAdmin.allowed) {
      memberEditTeamMemberships = (
        <MemberEditTeamMemberships
          isSelf={isSelf}
          organizationMember={this.props.organizationMember}
        />
      );
    }

    return (
      <DocumentTitle title={`Users · ${this.props.organizationMember.user.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <UserAvatar
                user={this.props.organizationMember.user}
                className="align-middle mr2"
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            </PageHeader.Icon>
            <PageHeader.Title className="truncate mr2">
              {this.props.organizationMember.user.name}
            </PageHeader.Title>
            <PageHeader.Description className="truncate mr2">
              {this.props.organizationMember.user.email}
            </PageHeader.Description>
            <PageHeader.Menu>
              <MemberEditRemove
                isSelf={isSelf}
                viewer={this.props.viewer}
                organizationMember={this.props.organizationMember}
              />
            </PageHeader.Menu>
          </PageHeader>
          <MemberEditRole
            isSelf={isSelf}
            viewer={this.props.viewer}
            organizationMember={this.props.organizationMember}
          />
          {memberEditTeamMemberships}
        </div>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(Edit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${MemberEditRemove.getFragment('viewer')}
        user {
          id
        }
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        ${MemberEditRole.getFragment('organizationMember')}
        ${MemberEditRemove.getFragment('organizationMember')}
        ${MemberEditTeamMemberships.getFragment('organizationMember')}
        uuid
        organization {
          permissions {
            teamAdmin {
              allowed
            }
          }
        }
        user {
          id
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
