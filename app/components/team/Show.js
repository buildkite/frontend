import React from 'react';
import Relay from 'react-relay';

import PageHeader from '../shared/PageHeader';
import Button from '../shared/Button'

import Pipelines from './Pipelines';
import Members from './Members';

import TeamDeleteMutation from '../../mutations/TeamDelete';

class Show extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    team: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      slug: React.PropTypes.string.isRequired
    }).isRequired
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
    if(!this.props.team) {
      return null;
    }

    return (
      <div>
	<PageHeader>
          <PageHeader.Title>{this.props.team.name}</PageHeader.Title>
          <PageHeader.Description>{this.props.team.description}</PageHeader.Description>

          <PageHeader.Menu>
            <PageHeader.Button
              link={`/organizations/${this.props.organization.slug}/teams/${this.props.team.slug}/edit`}>Edit</PageHeader.Button>
            <PageHeader.Button
              loading={this.state.removing ? "Deleting…" : false}
              onClick={this.handleRemoveTeamClick}>Delete</PageHeader.Button>
          </PageHeader.Menu>
	</PageHeader>

        <Members team={this.props.team} className="mb4" />
        <Pipelines team={this.props.team} />
      </div>
    );
  }

  handleRemoveTeamClick = () => {
    // Show the removing indicator
    this.setState({ removing: true });

    var mutation = new TeamDeleteMutation({
      team: this.props.team
    });

    // Run the mutation
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleDeleteTeamMutationSuccess,
      onFailure: this.handleDeleteTeamMutationFailure
    });
  }

  handleDeleteTeamMutationSuccess = () => {
    // Redirect back to the index page
    this.context.router.push(`/organizations/${this.props.organization.slug}/teams`);
  }

  handleDeleteTeamMutationFailure = (transaction) => {
    // Hide the removing indicator
    this.setState({ removing: false });

    alert(transaction.getError());
  }
}

// ${TeamPipelines.getFragment('team')}
// ${TeamMembers.getFragment('team')}

export default Relay.createContainer(Show, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
	slug
      }
    `,
    team: () => Relay.QL`
      fragment on Team {
        ${Pipelines.getFragment('team')}
        ${Members.getFragment('team')}
        ${TeamDeleteMutation.getFragment('team')}
	name
	description
	slug
      }
    `
  }
});
