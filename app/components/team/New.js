import React from 'react';
import Relay from 'react-relay';

import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import Button from '../shared/Button';
import TeamForm from './Form';
//
// import CreateTeamMutation from '../mutations/CreateTeamMutation';

class New extends React.Component {
  state = {
    name: '',
    description: '',
    saving: false,
    errors: null
  };

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <PageHeader>Create New Team</PageHeader>

        <Panel>
          <Panel.Body>
            <TeamForm
              onChange={this.handleFormChange}
              errors={this.state.errors}
              name={this.state.name}
              description={this.state.description} />
          </Panel.Body>

          <Panel.Footer>
            <Button loading={this.state.saving ? "Creating team…" : false}>Create Team</Button>
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

    // var mutation = new CreateTeamMutation({
    //   organization: this.props.organization,
    //   name: this.state.name,
    //   description: this.state.description
    // });

    // Relay.Store.update(mutation, {
    //   onSuccess: this.handleMutationSuccess.bind(this),
    //   onFailure: this.handleMutationError.bind(this)
    // });
  };

  handleMutationError = (transaction) => {
    var error = transaction.getError();
    if(error) {
      if(error.source && error.source.type == "RECORD_INVALID") {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = (response) => {
    this.props.history.pushState(null, `/organizations/${this.props.organization.slug}/teams/${response.createTeam.teamEdge.node.slug}`);
  };
}

New.propTypes = {
  organization: React.PropTypes.shape({
    slug: React.PropTypes.string.isRequired
  }).isRequired,
  history: React.PropTypes.object.isRequired
};

// ${CreateTeamMutation.getFragment('organization')}

export default Relay.createContainer(New, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
      }
    `
  }
});
