import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from 'app/components/shared/Panel';

import TeamForm from './Form';
import TeamDelete from './TeamDelete';

import TeamUpdateMutation from 'app/mutations/TeamUpdate';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import FlashesStore from 'app/stores/FlashesStore';

class TeamEdit extends React.Component {
  static propTypes = {
    team: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      description: PropTypes.string,
      privacy: PropTypes.string.isRequired,
      isDefaultTeam: PropTypes.bool.isRequired,
      defaultMemberRole: PropTypes.string.isRequired,
      organization: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    name: this.props.team.name,
    description: this.props.team.description,
    privacy: this.props.team.privacy,
    isDefaultTeam: this.props.team.isDefaultTeam,
    defaultMemberRole: this.props.team.defaultMemberRole,
    saving: false,
    errors: null
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <TeamForm
            onChange={this.handleFormChange}
            errors={this.state.errors}
            name={this.state.name}
            description={this.state.description}
            privacy={this.state.privacy}
            isDefaultTeam={this.state.isDefaultTeam}
            saving={this.state.saving}
            button={this.state.saving ? "Saving team…" : "Save Team"}
          />
        </form>

        <TeamDelete team={this.props.team} />

        <Panel className="mt3">
          <Panel.Header>REST API Integration</Panel.Header>
          <Panel.Section>
            <p>You can use this UUID to reference this team when using the <a href="/docs/rest-api/pipelines#create-a-pipeline" className="lime hover-lime text-decoration-none hover-underline">Create Pipeline REST API</a>.</p>
            <code className="block bg-silver p2 rounded">{this.props.team.uuid}</code>
          </Panel.Section>
        </Panel>
      </div>
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

    const mutation = new TeamUpdateMutation({
      team: this.props.team,
      name: this.state.name,
      description: this.state.description,
      privacy: this.state.privacy,
      isDefaultTeam: this.state.isDefaultTeam,
      defaultMemberRole: this.state.defaultMemberRole
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    const error = transaction.getError();
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = (response) => {
    this.setState({ saving: false, errors: null });

    // Update the URL with the latest version of the slug
    this.context.router.replace(`/organizations/${this.props.team.organization.slug}/teams/${response.teamUpdate.team.slug}/settings`);

    FlashesStore.flash(FlashesStore.SUCCESS, "Settings for this team have been saved successfully");
  };
}

export default Relay.createContainer(TeamEdit, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${TeamUpdateMutation.getFragment('team')}
        ${TeamDelete.getFragment('team')}
        uuid
        name
        slug
        description
        privacy
        isDefaultTeam
        defaultMemberRole
        organization {
          name
          slug
        }
      }
    `
  }
});
