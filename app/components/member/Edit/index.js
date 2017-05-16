import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PageHeader from '../../shared/PageHeader';
import UserAvatar from '../../shared/UserAvatar';

import MemberEditRole from './Role';
import MemberEditRemove from './Remove';
import MemberEditMemberships from './Memberships';

const AVATAR_SIZE = 50;

class MemberEdit extends React.PureComponent {
  static propTypes = {
    viewer: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
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
            <PageHeader.Title>
              {this.props.organizationMember.user.name}
            </PageHeader.Title>
            <PageHeader.Description>
              {this.props.organizationMember.user.email}
            </PageHeader.Description>
            <PageHeader.Menu>
              <MemberEditRemove
                viewer={this.props.viewer}
                organizationMember={this.props.organizationMember}
              />
            </PageHeader.Menu>
          </PageHeader>
          <MemberEditRole
            viewer={this.props.viewer}
            organizationMember={this.props.organizationMember}
          />
          <MemberEditMemberships
            organizationMember={this.props.organizationMember}
          />
        </div>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(MemberEdit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${MemberEditRole.getFragment('viewer')}
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
        ${MemberEditMemberships.getFragment('organizationMember')}
        uuid
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
