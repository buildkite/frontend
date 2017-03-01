import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageHeader from '../shared/PageHeader';
// import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';
// import permissions from '../../lib/permissions';

// import OrganizationMemberDeleteMutation from '../../mutations/OrganizationMemberDelete';

const AVATAR_SIZE = 50;

class MemberShow extends React.Component {
  static propTypes = {
    organizationMember: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      admin: React.PropTypes.bool.isRequired,
      user: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        avatar: React.PropTypes.shape({
          url: React.PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    })
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    removing: false
  };

  render() {
    return (
      <DocumentTitle title={`Users · ${this.props.organizationMember.user.name}`}>
        <div>
          <PageHeader>
            <UserAvatar
              user={this.props.organizationMember.user}
              className="align-middle"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
            <PageHeader.Title>{this.props.organizationMember.user.name}</PageHeader.Title>
            <PageHeader.Description>{this.props.organizationMember.user.email}</PageHeader.Description>
          </PageHeader>
        </div>
      </DocumentTitle>
    );
  }
}

//${OrganizationMemberDeleteMutation.getFragment('organizationMember')}

export default Relay.createContainer(MemberShow, {
  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        admin
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
