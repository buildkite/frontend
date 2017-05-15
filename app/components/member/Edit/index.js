import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Button from '../../shared/Button';
import FormCheckbox from '../../shared/FormCheckbox';
import PageHeader from '../../shared/PageHeader';
import Panel from '../../shared/Panel';
import UserAvatar from '../../shared/UserAvatar';

import FlashesStore from '../../../stores/FlashesStore';

import OrganizationMemberUpdateMutation from '../../../mutations/OrganizationMemberUpdate';
import OrganizationMemberDeleteMutation from '../../../mutations/OrganizationMemberDelete';

import OrganizationMemberRoleConstants from '../../../constants/OrganizationMemberRoleConstants';

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
      role: PropTypes.string.isRequired,
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
    isAdmin: false,
    removing: false
  };

  componentWillMount() {
    this.setState({
      isAdmin: this.props.organizationMember.role === OrganizationMemberRoleConstants.ADMIN
    });
  }

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
          {this.renderRolePanel(isSelf)}
          {this.renderRemovePanel(isSelf)}
        </div>
      </DocumentTitle>
    );
  }

  renderRolePanel(isSelf) {
    // Don't show the remove panel if you can't actually update them
    if (!this.props.organizationMember.permissions.organizationMemberUpdate.allowed) {
      return (
        <Panel className="mb4">
          <Panel.Section>
            <p>{this.props.organizationMember.permissions.organizationMemberUpdate.message}</p>
          </Panel.Section>
        </Panel>
      );
    }

    const saveRowContent = (
      isSelf
        ? <span className="dark-gray">You can’t edit your own roles</span>
        : (
          <Button
            onClick={this.handleUpdateOrganizationMemberClick}
            loading={this.state.updating && 'Saving…'}
          >
            Save
          </Button>
        )
    );

    return (
      <Panel className="mb4">
        <Panel.Header>Roles</Panel.Header>
        <Panel.Row>
          <FormCheckbox
            label="Administrator"
            help="Allow this person to edit organization details, manage billing information, invite new members, change notification services and see the agent registration token."
            disabled={isSelf}
            onChange={this.handleAdminChange}
            checked={this.state.isAdmin}
          />
        </Panel.Row>
        <Panel.Row>
          {saveRowContent}
        </Panel.Row>
      </Panel>
    );
  }

  handleAdminChange = (evt) => {
    this.setState({
      isAdmin: evt.target.checked
    });
  }

  handleUpdateOrganizationMemberClick = () => {
    // Show the updating indicator
    this.setState({ updating: true });

    const mutation = new OrganizationMemberUpdateMutation({
      organizationMember: this.props.organizationMember,
      role: this.state.isAdmin ? OrganizationMemberRoleConstants.ADMIN : OrganizationMemberRoleConstants.MEMBER
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleUpdateMutationSuccess,
      onFailure: this.handleMutationFailure
    });
  }

  handleUpdateMutationSuccess = ({ organizationMemberUpdate }) => {
    this.setState({ updating: false });

    FlashesStore.flash(
      FlashesStore.SUCCESS,
      `${organizationMemberUpdate.organizationMember.user.name}’s member details have been saved`
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
      onSuccess: this.handleRemoveMutationSuccess,
      onFailure: this.handleMutationFailure
    });
  }

  handleRemoveMutationSuccess = (response) => {
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
        permissions {
          organizationMemberUpdate {
            allowed
            message
          }
          organizationMemberDelete {
            allowed
            message
          }
        }
        ${OrganizationMemberUpdateMutation.getFragment('organizationMember')}
        ${OrganizationMemberDeleteMutation.getFragment('organizationMember')}
      }
    `
  }
});
