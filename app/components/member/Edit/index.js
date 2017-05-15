import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Button from '../../shared/Button';
import PageHeader from '../../shared/PageHeader';
import Panel from '../../shared/Panel';
import UserAvatar from '../../shared/UserAvatar';

import FlashesStore from '../../../stores/FlashesStore';

import MemberEditRole from './role';

import OrganizationMemberDeleteMutation from '../../../mutations/OrganizationMemberDelete';

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
      permissions: PropTypes.object.isRequired,
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

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    removing: false
  };

  render() {
    if (!this.props.organizationMember) {
      return null;
    }

    const isSelf = this.props.organizationMember.user.id === this.props.viewer.user.id;

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
          {this.renderRemovePanel(isSelf)}
        </div>
      </DocumentTitle>
    );
  }

  renderRemovePanel(isSelf) {
    // Don't show the remove panel if you can't actually remove them
    if (!this.props.organizationMember.permissions.organizationMemberDelete.allowed) {
      return null;
    }

    return (
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
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationFailure
    });
  }

  handleMutationSuccess = (response) => {
    this.setState({ removing: false });

    if (response.organizationMemberDelete.user.id === this.props.viewer.user.id) {
      // if we remove ourself, kickflip outta there
      // because we won't have access anymore!
      window.location = '/';
    } else {
      this.context.router.push(`/organizations/${response.organizationMemberDelete.organization.slug}/users`);
    }
  }

  handleMutationFailure = (transaction) => {
    this.setState({ removing: false, updating: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }
}

export default Relay.createContainer(MemberEdit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${MemberEditRole.getFragment('viewer')}
        user {
          id
        }
      }
    `,
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        ${MemberEditRole.getFragment('organizationMember')}
        uuid
        user {
          id
          name
          email
          avatar {
            url
          }
        }
        permissions {
          organizationMemberDelete {
            allowed
            message
          }
        }
        ${OrganizationMemberDeleteMutation.getFragment('organizationMember')}
      }
    `
  }
});
