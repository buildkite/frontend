import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import DocumentTitle from 'react-document-title';

import Button from 'app/components/shared/Button';
import FormRadioGroup from 'app/components/shared/FormRadioGroup';
import FormTextarea from 'app/components/shared/FormTextarea';
import FormInputLabel from 'app/components/shared/FormInputLabel';
import FormInputHelp from 'app/components/shared/FormInputHelp';
import Panel from 'app/components/shared/Panel';
import PageHeader from 'app/components/shared/PageHeader';
import MemberTeamRow from './MemberTeamRow';

import FlashesStore from 'app/stores/FlashesStore';
import ValidationErrors from 'app/lib/ValidationErrors';

import OrganizationInvitationCreateMutation from 'app/mutations/OrganizationInvitationCreate';

import OrganizationMemberRoleConstants from 'app/constants/OrganizationMemberRoleConstants';
import OrganizationMemberSSOModeConstants from 'app/constants/OrganizationMemberSSOModeConstants';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import TeamMemberRoleConstants from 'app/constants/TeamMemberRoleConstants';

class MemberNew extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        organizationInvitationCreate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired,
          message: PropTypes.string
        })
      }),
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired,
              slug: PropTypes.string.isRequired,
              isDefaultTeam: PropTypes.bool.isRequired
            }).isRequired
          })
        ).isRequired
      }),
      ssoProviders: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    emails: '',
    teams: null, // when mounted we set this to the default teams
    role: OrganizationMemberRoleConstants.MEMBER,
    ssoMode: OrganizationMemberSSOModeConstants.REQUIRED,
    errors: null
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  componentWillReceiveProps(nextProps) {
    // Initialize state teams to default teams when mounted and we get props
    if (this.state.teams === null && nextProps.organization.teams) {
      const defaultTeams = nextProps.organization.teams.edges
        .filter(({ node }) => node.isDefaultTeam)
        .map(({ node }) => node.id);

      this.setState({ teams: defaultTeams });
    }
  }

  render() {
    let content;
    if (this.props.organization.permissions.organizationInvitationCreate.allowed) {
      content = this.renderForm();
    } else {
      content = this.renderPermissionErrorMessage();
    }

    return (
      <DocumentTitle title={`Users · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Title>
              Invite Users
            </PageHeader.Title>
          </PageHeader>
          {content}
        </div>
      </DocumentTitle>
    );
  }

  renderForm() {
    const errors = new ValidationErrors(this.state.errors);

    return (
      <Panel>
        <Panel.Section>
          <FormTextarea
            label="Email Addresses"
            help="This list of email addresses to invite, each one separated with a space or a new line"
            value={this.state.emails}
            errors={errors.findForField("emails")}
            onChange={this.handleEmailsChange}
            rows={3}
            required={true}
          />
        </Panel.Section>
        <Panel.Section>
          <FormRadioGroup
            name="role"
            label="Role"
            help="What type of organization-wide permissions will the invited users have?"
            value={this.state.role}
            onChange={this.handleAdminChange}
            required={true}
            options={[
              { label: "User", value: OrganizationMemberRoleConstants.MEMBER, help: "Can view, create and manage pipelines and builds." },
              { label: "Administrator", value: OrganizationMemberRoleConstants.ADMIN, help: "Can view and edit everything in the organization." }
            ]}
          />
        </Panel.Section>
        {this.renderTeamSection()}
        {this.renderSSOSection()}
        <Panel.Section>
          <Button
            onClick={this.handleCreateInvitationClick}
            loading={this.state.inviting && 'Sending Invitations…'}
          >
            Send Invitations
          </Button>
        </Panel.Section>
      </Panel>
    );
  }

  renderPermissionErrorMessage() {
    return (
      <Panel>
        <Panel.Section>
          <p className="red">{this.props.organization.permissions.organizationInvitationCreate.message}</p>
        </Panel.Section>
      </Panel>
    );
  }

  handleEmailsChange = (evt) => {
    this.setState({
      emails: evt.target.value
    });
  };

  handleAdminChange = (evt) => {
    this.setState({
      role: evt.target.value
    });
  };

  handleCreateInvitationClick = () => {
    // Show the inviting indicator
    this.setState({ inviting: true });

    const emails = this.state.emails
      .replace(',', ' ')
      // WARNING: This Regexp is fully qualified rather than `\s` as
      // this is designed to mirror back-end code and functionality
      // (see `app/models/account/invitation/creator.rb`), and RegExp
      // `\s` includes more (Unicode) characters than Ruby's in newer
      // browsers (those compliant with ES2017)
      .split(/[ \t\r\n\f\v]+/gi);

    const role = this.state.role;

    let teams = [];
    if (this.state.teams) {
      teams = this.state.teams.map((id) => {
        return { id: id, role: TeamMemberRoleConstants.MEMBER };
      });
    }

    let sso;
    if (this.props.organization.ssoProviders.count > 0) {
      sso = { mode: this.state.ssoMode };
    }

    const mutation = new OrganizationInvitationCreateMutation({
      organization: this.props.organization,
      emails,
      teams,
      role,
      sso
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleInvitationCreateSuccess,
      onFailure: this.handleInvitationCreateFailure
    });
  }

  handleInvitationCreateSuccess = () => {
    this.setState({ inviting: false });

    this.context.router.push(`/organizations/${this.props.organization.slug}/users`);
  }

  handleInvitationCreateFailure = (transaction) => {
    const error = transaction.getError();
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
      }
    }

    this.setState({ inviting: false });
  }

  renderTeamSection() {
    // If the teams haven't loaded yet
    if (!this.props.organization.teams) {
      return null;
    }

    // If there aren't any teams then we don't have the feature
    if (this.props.organization.teams.count === 0) {
      return null;
    }

    const teamEdges = this.props.organization.teams.edges;

    return (
      <Panel.Section>
        <FormInputLabel label="Teams" />
        <FormInputHelp>You can give the invited users additional permissions by adding them to one or more teams.</FormInputHelp>
        <div className="flex flex-wrap content-around mxn1 mt1">
          {teamEdges.map(({ node }) => (
            <MemberTeamRow
              key={node.id}
              team={node}
              checked={this.state.teams.includes(node.id)}
              onChange={this.handleTeamChange}
            />
          ))}
        </div>
      </Panel.Section>
    );
  }

  handleTeamChange = (team) => {
    let teams;
    const teamIndex = this.state.teams.indexOf(team.id);

    if (teamIndex === -1) {
      // adding
      teams = this.state.teams.concat([team.id]);
    } else {
      // removing
      teams = this.state.teams.concat();
      teams.splice(teamIndex, 1);
    }

    this.setState({ teams });
  };

  renderSSOSection() {
    // If the sso provider count hasn't loaded yet
    if (!this.props.organization.ssoProviders) {
      return null;
    }

    // If there aren't any sso providers then we don't need this section
    if (this.props.organization.ssoProviders.count === 0) {
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
              help: "Invited users will be required to authorize via SSO before they can accept the invitation.",
              badge: "Recomended"
            },
            {
              label: "Optional",
              value: OrganizationMemberSSOModeConstants.OPTIONAL,
              help: "The user can access accept the invitation without requiring a verified SSO authorization."
            }
          ]}
        />
      </Panel.Section>
    );
  }

  handleSSOModeChange = (evt) => {
    this.setState({
      ssoMode: evt.target.value
    });
  };
}

export default Relay.createContainer(MemberNew, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        permissions {
          organizationInvitationCreate {
            allowed
            message
          }
        }
        ssoProviders {
          count
        }
        teams(first: 50) @include(if: $isMounted) {
          count
          edges {
            node {
              id
              slug
              isDefaultTeam
              ${MemberTeamRow.getFragment('team')}
            }
          }
        }
        ${OrganizationInvitationCreateMutation.getFragment('organization')}
      }
    `
  }
});
