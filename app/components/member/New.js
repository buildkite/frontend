import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import FormCheckbox from '../shared/FormCheckbox';
import FormTextarea from '../shared/FormTextarea';
import Panel from '../shared/Panel';

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
              id: React.PropTypes.string.isRequired,
              name: React.PropTypes.string.isRequired
            }).isRequired
          })
        ).isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    emails: '',
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
          <Panel.Section>
            Teams
            Invited users can be added directly into teams. All users will be added to the <i>Everyone</i> team.
            {this.props.organization.teams.edges.map((team) => <FormCheckbox key={team.node.id} label={team.node.name} />)}
          </Panel.Section>
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

    const mutation = new OrganizationInvitationCreateMutation({
      organization: this.props.organization,
      emails,
      role
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleInvitationCreateSuccess,
      onFailure: this.handleInvitationCreateFailure
    });
  }

  handleInvitationCreateSuccess = (response) => {
    this.setState({ inviting: false });

    this.context.router.push(`/organizations/${response.organizationInvitationCreate.organization.slug}/users`);
  }

  handleInvitationCreateFailure = (transaction) => {
    this.setState({ inviting: false, updating: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  }
}

export default Relay.createContainer(MemberNew, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        teams(first: 100) {
          edges {
            node {
              id
              name
            }
          }
        }
        ${OrganizationInvitationCreateMutation.getFragment('organization')}
      }
    `
  }
});
