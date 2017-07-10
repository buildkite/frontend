import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Button from '../shared/Button';
import Panel from '../shared/Panel';

import TeamDeleteMutation from '../../mutations/TeamDelete';

class TeamDelete extends React.Component {
  static propTypes = {
    team: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        teamDelete: PropTypes.object.isRequired
      }).isRequired,
      organization: PropTypes.shape({
        slug: PropTypes.string.isRequired
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
    if (this.props.team.permissions.teamDelete.allowed) {
      return (
        <Panel className="mt3">
          <Panel.Header>Delete Team</Panel.Header>
          <Panel.Section>
            <p>Deleting this team will immediately revoke pipeline access to the members in this team.</p>
          </Panel.Section>
          <Panel.Section>
            <Button loading={this.state.removing ? "Deleting…" : false} onClick={this.handleButtonClick} theme="default" outline={true}>Delete Team</Button>
          </Panel.Section>
        </Panel>
      );
    }
  }

  handleButtonClick = () => {
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
    delete Relay.Store._storeData._cachedStore._rootCallMap.team[`${this.props.team.organization.slug}/${this.props.team.slug}`];

    // Redirect back to the index page
    this.context.router.push(`/organizations/${response.teamDelete.organization.slug}/teams`);
  }

  handleDeleteTeamMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ removing: false });

    alert(transaction.getError());
  }
}

export default Relay.createContainer(TeamDelete, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${TeamDeleteMutation.getFragment('team')}
        slug
        organization {
          slug
        }
        permissions {
          teamDelete {
            allowed
          }
        }
      }
    `
  }
});
