import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

import Button from 'app/components/shared/Button';
import FormRadioGroup from 'app/components/shared/FormRadioGroup';
import Panel from 'app/components/shared/Panel';

import FlashesStore from 'app/stores/FlashesStore';

import OrganizationMemberUpdateMutation from 'app/mutations/OrganizationMemberUpdate';

import OrganizationMemberRoleConstants from 'app/constants/OrganizationMemberRoleConstants';
import OrganizationMemberSSOModeConstants from 'app/constants/OrganizationMemberSSOModeConstants';

class Form extends React.PureComponent {
  static displayName = "Member.Edit.Form";

  static propTypes = {
    organizationMember: PropTypes.shape({
      role: PropTypes.string.isRequired,
      sso: PropTypes.shape({
        mode: PropTypes.string
      }).isRequired,
      permissions: PropTypes.object.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      organization: PropTypes.shape({
        ssoProviders: PropTypes.shape({
          count: PropTypes.number.isRequired
        }).isRequired
      }).isRequired
    })
  };

  state = {
    role: null,
    ssoMode: null
  };

  componentWillMount() {
    this.setState({
      role: this.props.organizationMember.role,
      ssoMode: this.props.organizationMember.sso.mode
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
          <FormRadioGroup
            label="Role"
            value={this.state.role}
            onChange={this.handleRoleChange}
            required={true}
            options={[
              {
                label: "User",
                value: OrganizationMemberRoleConstants.MEMBER,
                help: "Can view, create and manage pipelines and builds."
              },
              {
                label: "Administrator",
                value: OrganizationMemberRoleConstants.ADMIN,
                help: "Can view and edit everything in the organization."
              }
            ]}
          />
        </Panel.Section>
        {this.renderSSOSection()}
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

  renderSSOSection() {
    if (!this.isSSOEnabled()) {
      return null;
    }

    return (
      <Panel.Section>
        <FormRadioGroup
          label="Single Sign-On"
          value={this.state.ssoMode}
          onChange={this.handleSSOModeChange}
          required={true}
          options={[
            {
              label: "Required",
              value: OrganizationMemberSSOModeConstants.REQUIRED,
              help: "A verified SSO authorization is required before this user can access organization details.",
              badge: "Recomended"
            },
            {
              label: "Optional",
              value: OrganizationMemberSSOModeConstants.OPTIONAL,
              help: "The user can access organization details either via SSO, or with their Buildkite email and password."
            }
          ]}
        />
      </Panel.Section>
    );
  }

  isSSOEnabled() {
    return (
      this.props.organizationMember.organization.ssoProviders.count > 0
    );
  }

  handleRoleChange = (evt) => {
    this.setState({
      role: evt.target.value
    });
  }

  handleSSOModeChange = (evt) => {
    this.setState({
      ssoMode: evt.target.value
    });
  }

  handleUpdateOrganizationMemberClick = () => {
    // Show the updating indicator
    this.setState({ updating: true });

    const variables = {
      organizationMember: this.props.organizationMember,
      role: this.state.role
    };

    if (this.isSSOEnabled()) {
      variables.sso = {
        mode: this.state.ssoMode
      };
    }

    const mutation = new OrganizationMemberUpdateMutation(variables);

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
        sso {
          mode
        }
        user {
          name
        }
        organization {
          ssoProviders {
            count
          }
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
