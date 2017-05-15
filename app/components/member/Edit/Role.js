import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Button from '../../shared/Button';
import FormCheckbox from '../../shared/FormCheckbox';
import Panel from '../../shared/Panel';

import FlashesStore from '../../../stores/FlashesStore';

import OrganizationMemberUpdateMutation from '../../../mutations/OrganizationMemberUpdate';

import OrganizationMemberRoleConstants from '../../../constants/OrganizationMemberRoleConstants';

class MemberEditRole extends React.PureComponent {
  static propTypes = {
    viewer: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    organizationMember: PropTypes.shape({
      role: PropTypes.string.isRequired,
      permissions: PropTypes.object.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    })
  };

  state = {
    isAdmin: false
  };

  componentWillMount() {
    this.setState({
      isAdmin: this.props.organizationMember.role === OrganizationMemberRoleConstants.ADMIN
    });
  }

  render() {
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

    const isSelf = this.props.organizationMember.user.id === this.props.viewer.user.id;

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
      <div className="mb4">
        <h2 className="h2">Roles</h2>
        <Panel>
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
      </div>
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
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationFailure
    });
  }

  handleMutationSuccess = ({ organizationMemberUpdate }) => {
    this.setState({ updating: false });

    FlashesStore.flash(
      FlashesStore.SUCCESS,
      `${organizationMemberUpdate.organizationMember.user.name}’s member details have been saved`
    );
  }

  handleMutationFailure = (transaction) => {
    this.setState({ updating: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }
}

export default Relay.createContainer(MemberEditRole, {
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
        role
        user {
          id
          name
        }
        permissions {
          organizationMemberUpdate {
            allowed
            message
          }
        }
        ${OrganizationMemberUpdateMutation.getFragment('organizationMember')}
      }
    `
  }
});
