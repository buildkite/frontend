import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import Panel from '../shared/Panel';

import FlashesStore from '../../stores/FlashesStore';

import OrganizationInvitationCreateMutation from '../../mutations/OrganizationInvitationCreate';

import OrganizationMemberRoleConstants from '../../constants/OrganizationMemberRoleConstants';

class MemberNew extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
    }).isRequired
  };

  state = {
    emails: ''
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
            Email addresses of people to invite
            Separate each email with a space or a new line
          </Panel.Section>
          <Panel.Section>
            Teams
            Invited users can be added directly into teams. All users will be added to the <i>Everyone</i> team.
          </Panel.Section>
          <Panel.Section>
            Administrator
          </Panel.Section>
          <Panel.Section>
            <Button>Send Invitations</Button>
          </Panel.Section>
        </Panel>
      </DocumentTitle>
    );
  }

  handleCreateInvitationClick = () => {
    // Show the inviting indicator
    this.setState({ inviting: true });

    const mutation = new OrganizationInvitationCreateMutation({
      organization: this.props.organization
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
        ${OrganizationInvitationCreateMutation.getFragment('organization')}
      }
    `
  }
});
