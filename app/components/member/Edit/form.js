import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Button from '../../shared/Button';
import FormCheckbox from '../../shared/FormCheckbox';
import Panel from '../../shared/Panel';

import FlashesStore from '../../../stores/FlashesStore';

import OrganizationMemberUpdateMutation from '../../../mutations/OrganizationMemberUpdate';

import OrganizationMemberRoleConstants from '../../../constants/OrganizationMemberRoleConstants';

class Form extends React.PureComponent {
  static displayName = "Member.Edit.Form";

  static propTypes = {
    organizationMember: PropTypes.shape({
      role: PropTypes.string.isRequired,
      permissions: PropTypes.object.isRequired,
      user: PropTypes.shape({
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
    if (!this.props.organizationMember.permissions.organizationMemberUpdate.allowed) {
      return (
        <Panel>
          <Panel.Section>
            {this.props.organizationMember.permissions.organizationMemberUpdate.message}
          </Panel.Section>
        </Panel>
      );
    }
    return (
      <Panel>
        <Panel.Section>
          <FormCheckbox
            label="Administrator"
            help="Allow this person to edit organization details, manage billing information, invite new members, change notification services and see agent registration tokens."
            onChange={this.handleAdminChange}
            checked={this.state.isAdmin}
          />
        </Panel.Section>
        <Panel.Section>
          <Button
            onClick={this.handleUpdateOrganizationMemberClick}
            loading={this.state.updating && 'Saving User…'}
          >
              Save User
            </Button>
        </Panel.Section>
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

export default Relay.createContainer(Form, {
  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        role
        user {
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
