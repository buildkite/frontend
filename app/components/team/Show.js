import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import Emojify from '../shared/Emojify';
import permissions from '../../lib/permissions';
import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

import Pipelines from './Pipelines';
import Members from './Members';

import TeamDeleteMutation from '../../mutations/TeamDelete';

class TeamShow extends React.Component {
  static propTypes = {
    teamSlug: React.PropTypes.string.isRequired,
    team: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      slug: React.PropTypes.string.isRequired,
      everyone: React.PropTypes.bool.isRequired,
      privacy: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        slug: React.PropTypes.string.isRequired
      }).isRequired,
      permissions: React.PropTypes.shape({
        teamUpdate: React.PropTypes.object.isRequired,
        teamDelete: React.PropTypes.object.isRequired
      }).isRequired
    })
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    removing: false
  };

  render() {
    // If the team doesn't exist, that means that it's just been deleted. And
    // since we require all the team to render this component, we'll just
    // short-circut the re-render when it's gone. This isn't great, maybe
    // there's a beter way?
    if (!this.props.team) {
      return null;
    }

    return (
      <DocumentTitle title={`${this.props.team.name} · ${this.props.team.organization.name} Team`}>
        <div>
          <PageHeader>
            <div className="flex items-center"><h1 className="h1 m0 p0 block"><Emojify text={this.props.team.name} /></h1>{this.renderPrivacyLabel()}</div>
            <PageHeader.Description><Emojify text={this.props.team.description || "No description"} /></PageHeader.Description>
            <PageHeader.Menu>{this.renderMenu()}</PageHeader.Menu>
          </PageHeader>

          {this.renderMembers()}
          <Pipelines team={this.props.team} />
        </div>
      </DocumentTitle>
    );
  }

  renderPrivacyLabel() {
    if (this.props.team.privacy === TeamPrivacyConstants.SECRET) {
      return (
        <div className="ml1 regular small border border-gray rounded dark-gray p1">Secret</div>
      );
    }
  }

  renderMenu() {
    return permissions(this.props.team.permissions).collect(
      {
        allowed: "teamUpdate",
        render: (idx) => (
          <PageHeader.Button key={idx} link={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}/edit`}>Edit</PageHeader.Button>
        )
      },
      {
        allowed: "teamDelete",
        render: (idx) => (
          <PageHeader.Button key={idx} loading={this.state.removing ? "Deleting…" : false} onClick={this.handleRemoveTeamClick}>Delete</PageHeader.Button>
        )
      }
    );
  }

  renderMembers() {
    if (this.props.team.everyone) {
      return (
        <Panel className="mb4">
          <Panel.Header>Members</Panel.Header>
          <Panel.Section>This team is automatically managed by Buildkite so as you invite and remove users from your organization they are added and removed from this team.</Panel.Section>
        </Panel>
      );
    } else {
      return (
        <Members team={this.props.team} className="mb4" />
      );
    }
  }

  handleRemoveTeamClick = () => {
    if (confirm("Delete this team?")) {
      // Show the removing indicator
      this.setState({ removing: true });

      const mutation = new TeamDeleteMutation({
        team: this.props.team
      });

      // Run the mutation
      Relay.Store.commitUpdate(mutation, {
        onSuccess: this.handleDeleteTeamMutationSuccess,
        onFailure: this.handleDeleteTeamMutationFailure
      });
    }
  }

  handleDeleteTeamMutationSuccess = (response) => {
    // Relay at the moment seems to have a hard time updating the _rootCallMap
    // when a NODE_DELETE mutation is required. The net result being, that if
    // you create a team with name "foo", delete it, then create it again, Relay won't be
    // able to find it again using the `team` root query. That's because it's cached
    // the slug "org-name/this-slug-name" and it's old relay ID. So when we go
    // to request it again, Relay is like "oh, I know about this slug, but it
    // was deleted, so I'll just return nothing.
    delete Relay.Store._storeData._cachedStore._rootCallMap.team[this.props.teamSlug];

    // Redirect back to the index page
    this.context.router.push(`/organizations/${response.teamDelete.organization.slug}/teams`);
  }

  handleDeleteTeamMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ removing: false });

    alert(transaction.getError());
  }
}

export default Relay.createContainer(TeamShow, {
  initialVariables: {
    isEveryoneTeam: false
  },

  fragments: {
    team: (variables) => Relay.QL`
      fragment on Team {
        ${Pipelines.getFragment('team')}
        ${Members.getFragment('team').unless(variables.isEveryoneTeam)}
        ${TeamDeleteMutation.getFragment('team')}
        name
        description
        slug
        everyone
        privacy
        organization {
          name
          slug
        }
        permissions {
          teamUpdate {
            allowed
          }
          teamDelete {
            allowed
          }
        }
      }
    `
  }
});
