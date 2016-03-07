import React from 'react';
import Relay from 'react-relay';

import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import Button from '../shared/Button';
import TeamForm from './Form';

import TeamUpdateMutation from '../../mutations/TeamUpdate';
import GraphQLErrors from '../../constants/GraphQLErrors';

class New extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    team: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      description: React.PropTypes.string
    }).isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    name: this.props.team.name,
    description: this.props.team.description,
    saving: false,
    errors: null
  };

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <PageHeader>
          <PageHeader.Title>Edit Team</PageHeader.Title>
        </PageHeader>

        <Panel>
          <Panel.Body>
            <TeamForm
              onChange={this.handleFormChange}
              errors={this.state.errors}
              name={this.state.name}
              description={this.state.description} />
          </Panel.Body>

          <Panel.Footer>
            <Button loading={this.state.saving ? "Saving team…" : false}>Save Team</Button>
          </Panel.Footer>
        </Panel>
      </form>
    );
  }

  handleFormChange = (field, value) => {
    var state = {};
    state[field] = value;

    this.setState(state);
  };

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.setState({ saving: true });

    var mutation = new TeamUpdateMutation({
      team: this.props.team,
      name: this.state.name,
      description: this.state.description
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    var error = transaction.getError();
    if(error) {
      if(error.source && error.source.type == GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = (response) => {
    this.context.router.push(`/organizations/${this.props.organization.slug}/teams/${response.teamUpdate.team.slug}`);
  };
}

export default Relay.createContainer(New, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
      }
    `,
    team: () => Relay.QL`
      fragment on Team {
        ${TeamUpdateMutation.getFragment('team')}
        name
        slug
        description
      }
    `
  }
});
