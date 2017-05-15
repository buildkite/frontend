import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Button from '../../shared/Button';
import Panel from '../../shared/Panel';

import FlashesStore from '../../../stores/FlashesStore';

import OrganizationMemberDeleteMutation from '../../../mutations/OrganizationMemberDelete';

class MemberEditRemove extends React.PureComponent {
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
        id: PropTypes.string.isRequired
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
    // Don't show the remove panel if you can't actually remove them
    if (!this.props.organizationMember.permissions.organizationMemberDelete.allowed) {
      return null;
    }

    const isSelf = this.props.organizationMember.user.id === this.props.viewer.user.id;

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

export default Relay.createContainer(MemberEditRemove, {
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
        user {
          id
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
