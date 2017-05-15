import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageHeader from '../../shared/PageHeader';
import UserAvatar from '../../shared/UserAvatar';

import MemberEditRole from './role';
import MemberEditRemove from './remove';

const AVATAR_SIZE = 50;

class MemberEdit extends React.PureComponent {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    organizationMember: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      user: PropTypes.shape({
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
          </PageHeader>
          <MemberEditRole
            viewer={this.props.viewer}
            organizationMember={this.props.organizationMember}
          />
          <MemberEditRemove
            viewer={this.props.viewer}
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
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        ${MemberEditRole.getFragment('organizationMember')}
        ${MemberEditRemove.getFragment('organizationMember')}
        uuid
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
