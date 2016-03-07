import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import PageHeader from '../shared/PageHeader';
import Button from '../shared/Button'

// import TeamPipelines from '../components/TeamPipelines';
// import TeamMembers from '../components/TeamMembers';

// import DeleteTeamMutation from '../mutations/DeleteTeamMutation';

class Show extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    removing: false
  };

  render() {
    // If the team doesn't have an organization, that means that it's just been
    // deleted. And since we require all the org to render this component,
    // we'll just short-circut the re-render when it's gone.  This isn't great,
    // maybe there's a beter way?
    // if(!this.props.viewer.team.organization) {
    //   return null;
    // }

    return (
      <div>
	<PageHeader>
          <PageHeader.Title>{this.props.team.name}</PageHeader.Title>
          <PageHeader.Description>{this.props.team.description}</PageHeader.Description>

          <PageHeader.Menu>
            <PageHeader.Button
              link={`/organizations/${this.props.organization.slug}/teams/${this.props.team.slug}/edit`}>Edit</PageHeader.Button>
            <PageHeader.Button
              loading={this.state.removing}
              loadingText={"Deleting…"}
              onClick={this.handleRemoveTeamClick}>Delete</PageHeader.Button>
          </PageHeader.Menu>
	</PageHeader>

        <div>
          Team info here
        </div>
      </div>
    );
  }

  handleRemoveTeamClick = () => {
    // Show the removing indicator
    this.setState({ removing: true });

    // var mutation = new DeleteTeamMutation({
    //   team: this.props.viewer.team
    // });

    // // Run the mutation
    // Relay.Store.update(mutation, {
    //   onSuccess: this.handleDeleteTeamMutationSuccess,
    //   onFailure: this.handleDeleteTeamMutationFailure
    // });
  }

  handleDeleteTeamMutationSuccess = (response) => {
    // Redirect back to the list page
    this.props.history.pushState(null, `/organizations/${this.props.organization.slug}/teams`);
  }

  handleDeleteTeamMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ removing: false });

    alert(transaction.getError());
  }
}

// ${TeamPipelines.getFragment('team')}
// ${TeamMembers.getFragment('team')}
// ${DeleteTeamMutation.getFragment('team')}

export default Relay.createContainer(Show, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
	slug
      }
    `,
    team: () => Relay.QL`
      fragment on Team {
	name
	description
	slug
      }
    `
  }
});
