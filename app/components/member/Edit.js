import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';
// import permissions from '../../lib/permissions';

import FlashesStore from '../../stores/FlashesStore';

import OrganizationMemberDeleteMutation from '../../mutations/OrganizationMemberDelete';

const AVATAR_SIZE = 50;

class MemberEdit extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      user: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
      }).isRequired
    }),
    organizationMember: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      role: React.PropTypes.string.isRequired,
      user: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const isSelf = this.props.organizationMember.user.id === this.props.viewer.user.id;

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
          <Panel className="mb4">
            <Panel.Header>Roles</Panel.Header>
            <Panel.Row>
              Administrator etc.
            </Panel.Row>
            <Panel.Row>
              You can't edit your own roles
            </Panel.Row>
          </Panel>
          <Panel>
            <Panel.Header>
              {isSelf ? 'Leave Organization' : 'Remove from Organization'}
            </Panel.Header>
            <Panel.Row>
              {
                isSelf
                  ? 'Removing yourself will immediately revoke your access to this organization.'
                  : 'Removing this user will immediately revoke their access to this organization.'
              }
            </Panel.Row>
            <Panel.Row>
              <Button
                theme="error"
                loading={
                  this.state.removing && (
                    isSelf
                      ? 'Leaving Organization…'
                      : 'Removing from Organization…'
                  )
                }
                onClick={this.handleRemoveFromOrganizationClick}
              >
                {
                  isSelf
                    ? 'Leave Organization'
                    : 'Remove from Organization'
                }
              </Button>
            </Panel.Row>
          </Panel>
        </div>
      </DocumentTitle>
    );
  }

  handleRemoveFromOrganizationClick = () => {
    // Show the removing indicator
    this.setState({ removing: true });

    const mutation = new OrganizationMemberDeleteMutation({
      organizationMember: this.props.organizationMember
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleRemoveMutationSuccess,
      onFailure: this.handleRemoveMutationFailure
    });
  }

  handleRemoveMutationSuccess = (response) => {
    this.setState({ removing: false });

    this.context.router.push(`/organizations/${response.organizationMemberDelete.organization.slug}/users`);
  }

  handleRemoveMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ removing: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }
}

export default Relay.createContainer(MemberEdit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
        }
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        role
        user {
          id
          name
          email
          avatar {
            url
          }
        }
        ${OrganizationMemberDeleteMutation.getFragment('organizationMember')}
      }
    `
  }
});
