import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Button from 'app/components/shared/Button';
import Panel from 'app/components/shared/Panel';

import FlashesStore from 'app/stores/FlashesStore';

import OrganizationMemberDeleteMutation from 'app/mutations/OrganizationMemberDelete';

class Remove extends React.PureComponent {
  static displayName = "Member.Edit.Remove";

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

    const loading = this.state.removing && 'Removing from Organization…';

    return (
      <Panel className="mt3">
        <Panel.Header>Remove from Organization</Panel.Header>
        <Panel.Section>
          <p>Removing this user will immediately revoke their access to this organization.</p>
        </Panel.Section>
        <Panel.Section>
          <Button theme="default" outline={true} loading={loading} onClick={this.handleRemoveClick}>
            Remove from Organization
          </Button>
        </Panel.Section>
      </Panel>
    );
  }

  handleRemoveClick = () => {
    const message = 'Removing this user will immediately revoke their access to this organization.';

    if (confirm(message)) {
      this.performRemove();
    }
  };

  performRemove = () => {
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
  };

  handleMutationSuccess = (response) => {
    this.setState({ removing: false });

    if (response.organizationMemberDelete.user.id === this.props.viewer.user.id) {
      // if we remove ourself, kickflip outta there
      // because we won't have access anymore!
      window.location = '/';
    } else {
      this.context.router.push(`/organizations/${response.organizationMemberDelete.organization.slug}/users`);
    }
  };

  handleMutationFailure = (transaction) => {
    this.setState({ removing: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(Remove, {
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
