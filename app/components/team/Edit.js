import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import Button from '../shared/Button';
import TeamForm from './Form';

import TeamUpdateMutation from '../../mutations/TeamUpdate';
import GraphQLErrors from '../../constants/GraphQLErrors';
import FlashesStore from '../../stores/FlashesStore';

class TeamEdit extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      organization: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        slug: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    name: this.props.team.name,
    description: this.props.team.description,
    privacy: this.props.team.privacy,
    saving: false,
    errors: null
  };

  render() {
    return (
      <DocumentTitle title={`Edit ${this.props.team.organization.name} · ${this.props.team.organization.name} Team`}>
        <form onSubmit={this.handleFormSubmit}>
          <PageHeader>
            <PageHeader.Title>Edit Team</PageHeader.Title>
          </PageHeader>

          <Panel>
            <Panel.Section>
              <TeamForm
                onChange={this.handleFormChange}
                errors={this.state.errors}
                name={this.state.name}
                description={this.state.description}
                privacy={this.state.privacy}
              />
            </Panel.Section>

            <Panel.Footer>
              <Button loading={this.state.saving ? "Saving team…" : false} theme="success">Save Team</Button>
            </Panel.Footer>
          </Panel>
        </form>
      </DocumentTitle>
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
      privacy: this.state.privacy
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
    this.context.router.push(`/organizations/${this.props.team.organization.slug}/teams/${response.teamUpdate.team.slug}`);
  };
}

export default Relay.createContainer(TeamEdit, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${TeamUpdateMutation.getFragment('team')}
        name
        slug
        description
        privacy
        organization {
          name
          slug
        }
      }
    `
  }
});
