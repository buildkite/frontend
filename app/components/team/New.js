import React from 'react';
import Relay from 'react-relay';

import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import Button from '../shared/Button';
// import TeamForm from './TeamForm';
//
// import CreateTeamMutation from '../mutations/CreateTeamMutation';

class New extends React.Component {
  state = {
    name: '',
    description: '',
    saving: false,
    errors: null
  };

  //     <PanelForm>
  //       <TeamForm
  //         onChange={this._handleFormChange.bind(this)}
  //         errors={this.state.errors}
  //         name={this.state.name}
  //         description={this.state.description} />
  //     </PanelForm>

  render() {
    return (
      <form onSubmit={this._handleFormSubmit.bind(this)}>
        <PageHeader>Create New Team</PageHeader>

        <Panel>
          <Panel.Body>
            Form here
          </Panel.Body>

          <Panel.Footer>
            <Button loading={this.state.saving ? "Creating team…" : false}>Create Team</Button>
          </Panel.Footer>
        </Panel>
      </form>
    );
  }

  _handleFormChange(field, value) {
    var state = {};
    state[field] = value;

    this.setState(state);
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    this.setState({ saving: true });

    var mutation = new CreateTeamMutation({
      organization: this.props.viewer.organization,
      name: this.state.name,
      description: this.state.description
    });

    Relay.Store.update(mutation, {
      onSuccess: this._handleMutationSuccess.bind(this),
      onFailure: this._handleMutationError.bind(this)
    });
  }

  _handleMutationError(transaction) {
    var error = transaction.getError();
    if(error) {
      if(error.source && error.source.type == "RECORD_INVALID") {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  }

  _handleMutationSuccess(response) {
    this.props.history.pushState(null, `/organizations/${this.props.viewer.organization.slug}/teams/${response.createTeam.teamEdge.node.slug}`);
  }
}

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
