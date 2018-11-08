import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';

import PageHeader from 'app/components/shared/PageHeader';
import Panel from 'app/components/shared/Panel';
import TeamForm from './Form';

import GraphQLErrors from 'app/constants/GraphQLErrors';
import TeamMemberRoleConstants from 'app/constants/TeamMemberRoleConstants';
import TeamPrivacyConstants from 'app/constants/TeamPrivacyConstants';

class TeamNew extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        teamCreate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired,
          message: PropTypes.string
        })
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    name: '',
    description: '',
    privacy: TeamPrivacyConstants.VISIBLE,
    isDefaultTeam: false,
    defaultMemberRole: TeamMemberRoleConstants.MEMBER,
    saving: false,
    errors: null
  };

  render() {
    let content;
    if (this.props.organization.permissions.teamCreate.allowed) {
      content = this.renderForm();
    } else {
      content = this.renderPermissionErrorMessage();
    }

    return (
      <DocumentTitle title={`New Team · ${this.props.organization.name}`}>
        <form onSubmit={this.handleFormSubmit}>
          <PageHeader>
            <PageHeader.Title>New Team</PageHeader.Title>
          </PageHeader>
          {content}
        </form>
      </DocumentTitle>
    );
  }

  renderForm() {
    return (
      <TeamForm
        onChange={this.handleFormChange}
        errors={this.state.errors}
        name={this.state.name}
        description={this.state.description}
        privacy={this.state.privacy}
        isDefaultTeam={this.state.isDefaultTeam}
        autofocus={true}
        saving={this.state.saving}
        button={this.state.saving ? "Creating team…" : "Create Team"}
      />
    );
  }

  renderPermissionErrorMessage() {
    return (
      <Panel>
        <Panel.Section>
          <p className="red">{this.props.organization.permissions.teamCreate.message}</p>
        </Panel.Section>
      </Panel>
    );
  }

  handleFormChange = (field, value) => {
    const state = {};
    state[field] = value;

    this.setState(state);
  };

  handleFormSubmit = (evt) => {
    evt.preventDefault();

    this.setState({ saving: true });

    const mutation = graphql`mutation TeamNewMutation($input: TeamCreateInput!) {
      teamCreate(input: $input) {
        clientMutationId
        organization {
          id
          teams {
            count
          }
        }
        teamEdge {
          node {
            slug
          }
        }
      }
    }`;

    const variables = {
      input: {
        organizationID: this.props.organization.id,
        name: this.state.name,
        description: this.state.description,
        privacy: this.state.privacy,
        isDefaultTeam: this.state.isDefaultTeam,
        defaultMemberRole: this.state.defaultMemberRole
      }
    };

    commitMutation(
      this.props.relay.environment,
      {
        mutation: mutation,
        variables: variables,
        onCompleted: this.handleMutationComplete,
        onError: this.handleMutationError
      }
    );
  };

  handleMutationError = (error) => {
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: error.source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationComplete = (response) => {
    this.context.router.push(`/organizations/${this.props.organization.slug}/teams/${response.teamCreate.teamEdge.node.slug}`);
  };
}

export default createFragmentContainer(TeamNew, {
  organization: graphql`
    fragment TeamNew_organization on Organization {
      id
      name
      slug
      permissions {
        teamCreate {
          allowed
          message
        }
      }
    }
  `
});
