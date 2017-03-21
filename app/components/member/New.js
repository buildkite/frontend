import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import FormCheckbox from '../shared/FormCheckbox';
import FormTextarea from '../shared/FormTextarea';
import FormInputLabel from '../shared/FormInputLabel';
import FormInputHelp from '../shared/FormInputHelp';
import Panel from '../shared/Panel';
import TeamRow from './TeamRow';

import FlashesStore from '../../stores/FlashesStore';

import OrganizationInvitationCreateMutation from '../../mutations/OrganizationInvitationCreate';

import OrganizationMemberRoleConstants from '../../constants/OrganizationMemberRoleConstants';

class MemberNew extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      teams: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              id: React.PropTypes.string.isRequired
            }).isRequired
          })
        ).isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  state = {
    emails: '',
    teams: [],
    isAdmin: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <DocumentTitle title={`Users · ${this.props.organization.name}`}>
        <Panel>
          <Panel.Header>Invite New Users</Panel.Header>
          <Panel.Section>
            <FormTextarea
              label="Email addresses of people to invite"
              help="Separate each email with a space or a new line"
              value={this.state.emails}
              onChange={this.handleEmailsChange}
              rows={3}
            />
          </Panel.Section>
          {this.renderTeamSection()}
          <Panel.Section>
            <FormCheckbox
              label="Administrator"
              help="Allow these people to edit organization details, manage billing information, invite new members, manage teams, change notification services and see the agent registration token."
              checked={this.state.isAdmin}
              onChange={this.handleAdminChange}
            />
          </Panel.Section>
          <Panel.Section>
            <Button
              onClick={this.handleCreateInvitationClick}
              loading={this.state.inviting && 'Sending Invitations…'}
            >
              Send Invitations
            </Button>
          </Panel.Section>
        </Panel>
      </DocumentTitle>
    );
  }

  handleEmailsChange = (evt) => {
    this.setState({
      emails: evt.target.value
    });
  };

  handleAdminChange = (evt) => {
    this.setState({
      isAdmin: evt.target.checked
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

    const role = this.state.isAdmin ? OrganizationMemberRoleConstants.ADMIN : OrganizationMemberRoleConstants.MEMBER;

    const teams = this.state.teams.map(({ id }) => id);

    const mutation = new OrganizationInvitationCreateMutation({
      organization: this.props.organization,
      emails,
      teams,
      role
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
    this.setState({ inviting: false, updating: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }

  renderTeamSection() {
    const teamEdges = this.props.organization.teams.edges
      .filter(({ node }) =>
        node.name !== 'Everyone' && node.description !== 'All users in your organization'
      );

    return (
      <Panel.Section>
        <FormInputLabel label="Teams" />
        <FormInputHelp html="Invited users can be added directly into teams. All users will be added to the <i>Everyone</i> team." />
        <div className="flex flex-wrap content-around mxn1">
          {teamEdges.map(({ node }) =>
            <TeamRow
              key={node.id}
              team={node}
              checked={this.state.teams.includes(node.id)}
              onChange={this.handleTeamChange}
            />
          )}
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
}

export default Relay.createContainer(MemberNew, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        teams(first: 50) {
          edges {
            node {
              id
              name
              description
              ${TeamRow.getFragment('team')}
            }
          }
        }
        ${OrganizationInvitationCreateMutation.getFragment('organization')}
      }
    `
  }
});
